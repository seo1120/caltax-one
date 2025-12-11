// AWS Amplify 설정 파일
// Cognito User Pool 설정을 여기에 추가하세요

export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || 'YOUR_USER_POOL_ID',
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || 'YOUR_USER_POOL_CLIENT_ID',
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      signUpVerificationMethod: 'code', // 'code' 또는 'link'
      loginWith: {
        email: true,
        username: false,
        phone: false,
      },
    },
  },
};



