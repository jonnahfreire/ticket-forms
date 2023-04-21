import { useContext, useRef, useState } from "react";
import tw from "tailwind-styled-components";

import InputMask from "react-input-mask";

import { Formik } from "formik";

import { TaskContext, TaskProps } from "../contexts/TaskContext";
import { ToastDialog } from "./utils/Utilities";
import { validationSchema } from "../validators";

const Wrapper = tw.div`
  flex flex-1
  flex-col
  items-center
  justify-center
  w-screen h-screen
  sm:mt-10
  mt-10
`;

const InputWrapper = tw.div`
    flex
    flex-col
    justify-between
    mb-2
    w-[300px]
    sm:w-100
`;

const FormItemWrapper = tw.div`
    flex
    flex-col
`;

const Input = tw.input`
    flex-1 
    pl-2 mr-2
    min-h-[40px]
    text-sm 
    bg-[#F2F2F2] 
    outline-0 
    border border-[#1B1D37] rounded
`;

const SubmitButton = tw.button`
    font-semibold 
    text-white sm:text-sm 
    text-center
    mt-4
    rounded 
    bg-[#1B1D37]
    hover:bg-[#1B1D37]/[0.9] 
    hover:ease-in duration-200
    sm:min-w-[100px]
    min-w-full
    h-[40px]
`;

const ErrorsWrapper = tw.div`
    w-100
    flex-start
    justify-center
`;

const ErrorText = tw.span`
    text-left 
    text-[#dc2626]
    text-[.7rem]
    font-bold
`;
const maskedInpuStyle = `
    flex-1 
    pl-2 mr-2
    min-h-[40px]
    text-sm 
    bg-[#F2F2F2] 
    outline-0 
    border border-[#1B1D37] rounded
`;

const cepInpuStyle = maskedInpuStyle + "sm:w-[200px]";

interface DocumentTypeSelectProps {
  checked: boolean;
  onChange: (e: any) => void;
  label: string;
  htmlFor: string;
  placeholder?: string;
}
const DocumentTypeSelect = ({
  checked,
  onChange,
  label,
  htmlFor,
  placeholder,
}: DocumentTypeSelectProps) => {
  return (
    <div className="flex-row justify-center mb-2">
      <label htmlFor={htmlFor} className="font-bold mr-1 mb-2">
        {label}
      </label>
      <input
        className="mr-5"
        type="radio"
        name="document"
        placeholder={placeholder}
        id={htmlFor}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};

export const MainStack = () => {
  const taskContext = useContext(TaskContext);
  const [isCPF, setIsCPF] = useState(true);

  const timerRef = useRef(0);

  function handleChangeToast() {
    timerRef.current = window.setTimeout(() => {}, 100);

    return () => clearTimeout(timerRef.current);
  }

  function save(task: TaskProps): void {
    taskContext.editTask(task);
  }

  return (
    <Wrapper>
      <Formik
        initialValues={{
          cpf: "",
          cnpj: "",
          name: "",
          phone: "",
          email: "",
          street: "",
          number: "",
          cep: "",
          bairro: "",
          city: "",
          qtItems: "",
        }}
        validateOnChange={true}
        validateOnMount={true}
        onSubmit={(values) => {}}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          isValid,
          setFieldValue,
        }) => (
          <>
            <FormItemWrapper className="flex-col justify-start items-start min-w-fit pb-[20px]">
              <FormItemWrapper className="sm:flex-row">
                <FormItemWrapper>
                  <FormItemWrapper className="flex-row">
                    <DocumentTypeSelect
                      label="CPF"
                      htmlFor="cpf"
                      checked={isCPF}
                      onChange={() => setIsCPF(true)}
                    />
                    <DocumentTypeSelect
                      label="CNPJ"
                      htmlFor="cnpj"
                      checked={!isCPF}
                      onChange={() => setIsCPF(false)}
                    />
                  </FormItemWrapper>
                  <InputWrapper>
                    {isCPF ? (
                      <>
                        <InputMask
                          id="cpf"
                          className={maskedInpuStyle}
                          value={values.cpf}
                          onChange={handleChange("cpf")}
                          mask="999.999.999-99"
                          maskChar={null}
                        />
                      </>
                    ) : (
                      <>
                        <InputMask
                          id="cnpj"
                          className={maskedInpuStyle}
                          value={values.cnpj}
                          onChange={handleChange("cnpj")}
                          mask="999.999.999/999-99"
                          maskChar={null}
                        />
                      </>
                    )}
                  </InputWrapper>
                  {isCPF && errors.cpf && touched.cpf && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.cpf}</ErrorText>
                    </ErrorsWrapper>
                  )}
                  {!isCPF && errors.cnpj && touched.cnpj && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.cnpj}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>
                <FormItemWrapper>
                  <InputWrapper>
                    <label htmlFor="nome" className="mb-2">
                      Nome completo
                    </label>
                    <Input
                      id="nome"
                      value={values.name}
                      onChange={handleChange("name")}
                      required
                      maxLength={50}
                    />
                  </InputWrapper>
                  {errors.name && touched.name && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.name}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>
              </FormItemWrapper>

              {/* CONTATO */}
              <FormItemWrapper className="sm:flex-row items-start">
                <FormItemWrapper className="sm:w-100">
                  <InputWrapper>
                    <label htmlFor="phone" className="text-[.8rem] mb-2">
                      Celular
                    </label>
                    <InputMask
                      id="phone"
                      className={maskedInpuStyle}
                      value={values.phone}
                      onChange={handleChange("phone")}
                      mask="(99) 99999-9999"
                      maskChar={null}
                      required
                    />
                  </InputWrapper>
                  {errors.phone && touched.phone && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.phone}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>
                <FormItemWrapper className="sm:w-100">
                  <InputWrapper>
                    <label htmlFor="email" className="text-[.8rem] mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange("email")}
                      required
                      maxLength={40}
                    />
                  </InputWrapper>
                  {errors.email && touched.email && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.email}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>
              </FormItemWrapper>
              {/* ENDEREÇO */}
              <FormItemWrapper className="sm:flex-row items-start justify-between">
                <FormItemWrapper className="sm:w-[212px]">
                  <InputWrapper>
                    <label htmlFor="cep" className="text-[.8rem] mb-2">
                      CEP
                    </label>
                    <InputMask
                      id="cep"
                      className={cepInpuStyle}
                      value={values.cep}
                      onChange={handleChange("cep")}
                      mask="99.999-999"
                      maskChar={null}
                      required
                    />
                  </InputWrapper>
                  {errors.cep && touched.cep && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.cep}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>
                <FormItemWrapper className="sm:flex-1">
                  <InputWrapper>
                    <label htmlFor="rua" className="text-[.8rem] mb-2">
                      Rua
                    </label>
                    <Input
                      className="sm:flex-1"
                      id="rua"
                      value={values.street}
                      onChange={handleChange("street")}
                      required
                    />
                  </InputWrapper>
                  {errors.street && touched.street && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.street}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>
                <FormItemWrapper className="sm:w-[80px]">
                  <InputWrapper>
                    <label htmlFor="numero" className="text-[.8rem] mb-2">
                      Número
                    </label>
                    <Input
                      id="numero"
                      className="sm:w-[80px]"
                      value={values.number}
                      onChange={handleChange("number")}
                      required
                      maxLength={10}
                    />
                  </InputWrapper>
                  {errors.number && touched.number && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.number}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>
              </FormItemWrapper>

              <FormItemWrapper className="sm:flex-row">
                <FormItemWrapper>
                  <InputWrapper>
                    <label htmlFor="bairro" className="text-[.8rem] mb-2">
                      Bairro
                    </label>
                    <Input
                      className="sm:w-30 w-100"
                      id="bairro"
                      value={values.bairro}
                      onChange={handleChange("bairro")}
                      required
                    />
                  </InputWrapper>
                  {errors.bairro && touched.bairro && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.bairro}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>

                <FormItemWrapper>
                  <InputWrapper>
                    <label htmlFor="cidade" className="text-[.8rem] mb-2">
                      Cidade
                    </label>
                    <Input
                      className="sm:w-70 w-100"
                      id="cidade"
                      value={values.city}
                      onChange={handleChange("city")}
                      required
                    />
                  </InputWrapper>
                  {errors.city && touched.city && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.city}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>
              </FormItemWrapper>
              {/* ENDEREÇO */}
              <FormItemWrapper className="sm:flex-row items-center justify-between sm:w-full">
                <FormItemWrapper>
                  <InputWrapper>
                    <label htmlFor="qt-items" className="text-[.8rem] mb-2">
                      Quantidade de items do pedido
                    </label>
                    <InputMask
                      className={"sm:w-100" + maskedInpuStyle}
                      id="qt-items"
                      value={values.qtItems}
                      onChange={handleChange("qtItems")}
                      mask="9999"
                      maskChar={null}
                      required
                    />
                  </InputWrapper>
                  {errors.qtItems && touched.qtItems && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.qtItems}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>
                <SubmitButton className="sm:mr-2" type="submit" onClick={() => handleSubmit()}>
                  Enviar
                </SubmitButton>
              </FormItemWrapper>
            </FormItemWrapper>
          </>
        )}
      </Formik>
      {false && (
        <ToastDialog
          isOpen={true}
          handleOpen={handleChangeToast}
          handleClose={handleChangeToast}
        />
      )}
    </Wrapper>
  );
};
