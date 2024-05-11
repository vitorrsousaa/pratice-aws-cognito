import { cognitoClient } from "@/libs/cognitoClient";
import { response } from "@/utils/response";
import { AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

// Padrão dos resources da AWS
// Cria uma instância do client - vai usar as credenciais da AWS e identificar a region
// Enviar através do client os commands

// serverless deploy function -f profile

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
	try {
		const userId = event.requestContext.authorizer.jwt.claims.sub as string;

		const command = new AdminGetUserCommand({
			Username: userId,
			UserPoolId: process.env.COGNITO_POOL_ID,
		});

		const { UserAttributes } = await cognitoClient.send(command);

		const profile = UserAttributes?.reduce((acc, { Name, Value }) => {
			const keyMap = {
				given_name: "firstName",
			};

			return {
				// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
				...acc,
				[keyMap[Name as keyof typeof keyMap] ?? Name]: Value,
			};
		}, {});

		return response(200, {
			profile,
		});
	} catch (error) {
		return response(500, { error: "Internal Server Error" });
	}
}
