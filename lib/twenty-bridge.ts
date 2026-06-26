import crypto from "crypto";

type TwentyAuthToken = {
  token: string;
  expiresAt: string;
};

export type TwentyTokenPair = {
  accessOrWorkspaceAgnosticToken: TwentyAuthToken;
  refreshToken: TwentyAuthToken;
};

type GraphQLErrorPayload = {
  message?: string;
};

type TwentyGraphQLResponse<TData> = {
  data?: TData;
  errors?: GraphQLErrorPayload[];
};

const SIGN_IN_MUTATION = `
  mutation SignIn($email: String!, $password: String!, $captchaToken: String) {
    signIn(email: $email, password: $password, captchaToken: $captchaToken) {
      tokens {
        accessOrWorkspaceAgnosticToken {
          token
          expiresAt
        }
        refreshToken {
          token
          expiresAt
        }
      }
    }
  }
`;

const SIGN_UP_MUTATION = `
  mutation SignUp($email: String!, $password: String!, $locale: String, $verifyEmailRedirectPath: String) {
    signUp(
      email: $email
      password: $password
      locale: $locale
      verifyEmailRedirectPath: $verifyEmailRedirectPath
    ) {
      tokens {
        accessOrWorkspaceAgnosticToken {
          token
          expiresAt
        }
        refreshToken {
          token
          expiresAt
        }
      }
    }
  }
`;

function getTwentyBaseUrl() {
  const baseUrl = process.env.TWENTY_FRONTEND_URL ?? process.env.NEXT_PUBLIC_TWENTY_URL;

  if (!baseUrl) {
    throw new Error("Missing Twenty base URL.");
  }

  return baseUrl.replace(/\/$/, "");
}

function getTwentyAuthUrl() {
  const authUrl = process.env.TWENTY_METADATA_URL;

  if (authUrl) {
    return authUrl.replace(/\/$/, "");
  }

  return `${getTwentyBaseUrl()}/metadata`;
}

function getBridgeSecret() {
  const secret = process.env.TWENTY_BRIDGE_SECRET;

  if (!secret) {
    throw new Error("Missing TWENTY_BRIDGE_SECRET.");
  }

  return secret;
}

export function deriveTwentyPassword(userId: string) {
  return crypto
    .createHmac("sha256", getBridgeSecret())
    .update(userId)
    .digest("hex")
    .slice(0, 32);
}

async function executeTwentyGraphQL<TData>(
  query: string,
  variables: Record<string, unknown>,
): Promise<TData> {
  const response = await fetch(getTwentyAuthUrl(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Twenty GraphQL request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as TwentyGraphQLResponse<TData>;

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message ?? "Twenty GraphQL request failed.");
  }

  if (!payload.data) {
    throw new Error("Twenty GraphQL response was empty.");
  }

  return payload.data;
}

async function signInWithTwenty(email: string, password: string) {
  const result = await executeTwentyGraphQL<{
    signIn: { tokens: TwentyTokenPair };
  }>(SIGN_IN_MUTATION, {
    email,
    password,
  });

  return result.signIn.tokens;
}

async function signUpWithTwenty(email: string, password: string) {
  const result = await executeTwentyGraphQL<{
    signUp: { tokens: TwentyTokenPair };
  }>(SIGN_UP_MUTATION, {
    email,
    password,
    locale: "pt-BR",
    verifyEmailRedirectPath: "/welcome",
  });

  return result.signUp.tokens;
}

function shouldAutoProvisionTwentyAccount(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    message.includes("User not found") ||
    message.includes("Incorrect login method") ||
    message.includes("User was not created with email/password")
  );
}

export async function getTwentyTokenPairForUser(user: {
  id: string;
  email?: string | null;
}) {
  if (!user.email) {
    throw new Error("User email is required to open the CRM.");
  }

  const password = deriveTwentyPassword(user.id);

  try {
    return await signInWithTwenty(user.email, password);
  } catch (error) {
    if (!shouldAutoProvisionTwentyAccount(error)) {
      throw error;
    }

    return await signUpWithTwenty(user.email, password);
  }
}

export function buildTwentyHandoffUrl(tokenPair: TwentyTokenPair) {
  const encodedTokenPair = encodeURIComponent(JSON.stringify(tokenPair));

  return `${getTwentyBaseUrl()}/welcome?tokenPair=${encodedTokenPair}`;
}
