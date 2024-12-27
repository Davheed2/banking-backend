export interface IEnvironment {
	APP: {
		NAME?: string;
		PORT: number;
		ENV?: string;
		CLIENT: string;
	};
	DB: {
		URL: string;
	};
	JWT: {
		ACCESS_KEY: string;
		REFRESH_KEY: string;
	};
	JWT_EXPIRES_IN: {
		ACCESS: string;
		REFRESH: string;
	};
	REDIS: {
		URL: string;
		PORT: number;
		PASSWORD: string;
	};
	EMAIL: {
		GMAIL_USER: string;
		GMAIL_PASSWORD: string;
	};
}
