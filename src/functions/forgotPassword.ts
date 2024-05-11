import { cognitoClient } from "@/libs/cognitoClient";
import { bodyParser } from "@/utils/bodyParser";
import { response } from "@/utils/response";
import { ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

// Padrão dos resources da AWS
// Cria uma instância do client - vai usar as credenciais da AWS e identificar a region
// Enviar através do client os commands

export async function handler(event: APIGatewayProxyEventV2) {
	try {
		const { email } = bodyParser(event.body ?? "");

		const command = new ForgotPasswordCommand({
			ClientId: process.env.COGNITO_CLIENT_ID,
			Username: email,
		});

		await cognitoClient.send(command);

		return response(204);
	} catch (error) {
		return response(500, { error: "Internal Server Error" });
	}
}
