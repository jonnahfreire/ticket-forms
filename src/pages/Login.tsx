import { Formik } from "formik";
import MD5 from "crypto-js/md5";

import {
  ErrorText,
  ErrorsWrapper,
  FormItemWrapper,
  Input,
  InputWrapper,
  SubmitButton,
  Wrapper,
} from "./ClientForm";
import { loginValidationSchema } from "../validators";
import { login } from "../services/TicketService";

export const Login = () => {
  
  return (
    <Wrapper>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validateOnChange={true}
        validateOnMount={true}
        onSubmit={async (values, { resetForm, setFieldError }) => {
          login(values.email, MD5(values.password).toString())
            .then((response) => {
              if (response.error) {
                response.isPasswordError &&
                  setFieldError("password", response.message);
                response.isEmailError &&
                  setFieldError("email", response.message);
                return false;
              }

              location.href = `form`;
            })
            .catch(console.log);
        }}
        validateOnBlur={true}
        validationSchema={loginValidationSchema}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          touched,
          errors,
          setErrors,
          isValid,
          setFieldValue,
        }) => (
          <>
            <FormItemWrapper className="sm:flex-col">
              <FormItemWrapper>
                <h1 className="mb-5 font-bold">Login</h1>
              </FormItemWrapper>
              <FormItemWrapper>
                <InputWrapper>
                  <Input
                    type="email"
                    placeholder="Email"
                    onChange={handleChange("email")}
                    onKeyUp={(e) => {
                      if (e.key.includes("Enter")) {
                        handleSubmit();
                      }
                    }}
                  />
                </InputWrapper>
                {errors.email && touched.email && (
                  <ErrorsWrapper className="mb-4">
                    <ErrorText>{errors.email}</ErrorText>
                  </ErrorsWrapper>
                )}
              </FormItemWrapper>
              <FormItemWrapper>
                <InputWrapper>
                  <Input
                    type="password"
                    placeholder="Senha"
                    onChange={handleChange("password")}
                    onKeyUp={(e) => {
                      if (e.key.includes("Enter")) {
                        handleSubmit();
                      }
                    }}
                  />
                </InputWrapper>
                {errors.password && touched.password && (
                  <ErrorsWrapper>
                    <ErrorText>{errors.password}</ErrorText>
                  </ErrorsWrapper>
                )}
              </FormItemWrapper>
              <FormItemWrapper className="flex items-center cursor-pointer pr-2">
                <SubmitButton
                  type="submit"
                  className="w-[100%]"
                  onClick={() => handleSubmit()}
                >
                  Entrar
                </SubmitButton>
              </FormItemWrapper>
            </FormItemWrapper>
          </>
        )}
      </Formik>
    </Wrapper>
  );
};
