import { cognitoClient } from "@/libs/cognitoClient";
import { bodyParser } from "@/utils/bodyParser";
import { response } from "@/utils/response";
import {
	SignUpCommand,
	UsernameExistsException,
} from "@aws-sdk/client-cognito-identity-provider";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

// Padrão dos resources da AWS
// Cria uma instância do client - vai usar as credenciais da AWS e identificar a region
// Enviar através do client os commands

export async function handler(event: APIGatewayProxyEventV2) {
	try {
		const body = bodyParser(event.body ?? "");

		const command = new SignUpCommand({
			ClientId: process.env.COGNITO_CLIENT_ID,
			Username: body.email,
			Password: body.password,
			UserAttributes: [
				{
					Name: "given_name",
					Value: body.name,
				},
			],
		});

		const { UserSub } = await cognitoClient.send(command);

		return response(200, {
			user: {
				id: UserSub,
			},
		});
	} catch (error) {
		if (error instanceof UsernameExistsException) {
			return response(409, { error: "Username already exists" });
		}

		return response(500, { error: "Internal Server Error" });
	}
}
