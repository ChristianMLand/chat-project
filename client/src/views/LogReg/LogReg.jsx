import { registerUser, loginUser } from "~/services";
import { AuthForm } from "~/components";

export default function LogReg() {
  return (
    <main id="logreg">
      <AuthForm
        name="Register"
        service={registerUser}
        fields={{
          username: "text",
          email: "text",
          password: "password",
          confirmPassword: "password"
        }}
      />
      <AuthForm
        name="Login"
        service={loginUser}
        fields={{
          email: "text",
          password: "password"
        }}
      />
    </main>
  )
}