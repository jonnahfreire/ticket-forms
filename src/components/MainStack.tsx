import { useRef, useState } from "react";
import tw from "tailwind-styled-components";

import InputMask from "react-input-mask";
import { InputNumber as PrimeInputMaskNumber } from "primereact/inputnumber";

import "./utils/maskedNumberInputStyle.css";

import { Formik } from "formik";

import Loading from "../assets/loading.gif";
import { ToastDialog } from "./utils/Utilities";
import { validationSchema } from "../validators";
import {
  DataProps,
  createTicket,
  validateDocument,
} from "../services/TicketService";

const Wrapper = tw.div`
  flex flex-1
  flex-col
  items-center
  justify-center
  w-screen h-screen
`;

const LoadingWrapper = tw(Wrapper)`
  mt-0
  absolute
  w-full h-full
  bg-indigo-100/[0.7]
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

const maskedInputStyle = `
    flex-1 
    pl-2 mr-2
    min-h-[40px]
    text-sm 
    bg-[#F2F2F2] 
    outline-0 
    border border-[#1B1D37] rounded
`;

const cepInpuStyle = maskedInputStyle + "sm:w-[200px]";

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
  const [isCPF, setIsCPF] = useState(true);
  const [created, setCreated] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const timerRef = useRef(0);

  function handleChangeToast() {
    setCreated(!created);
    timerRef.current = window.setTimeout(() => setCreated(false), 5000);

    return () => clearTimeout(timerRef.current);
  }

  async function getAddressByCep(cep: string) {
    const url = `https://brasilapi.com.br/api/cep/v1/${cep.replace(/\D/g, "")}`;

    const request = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const response = await request.json();

    if (request.status == 200) {
      const { city, neighborhood, street } = response;
      return { city, neighborhood, street };
    }
    return null;
  }

  async function handleCreateTicket(data: DataProps) {
    setIsSubmiting(true);
    const response = await createTicket(data);
    if (response.code === 201) {
      setIsSubmiting(false);
      setTimeout(() => {
        setMessage(response.message);
        handleChangeToast();
      }, 1000);
    }
  }

  const initialValues = {
    cpf: "",
    cnpj: "",
    name: "",
    phone: "",
    email: "",
    street: "",
    number: "",
    cep: "",
    neighborhood: "",
    city: "",
    qtItems: "",
    purchaseValue: "",
  };

  return (
    <Wrapper>
      {isSubmiting && (
        <LoadingWrapper>
          <img src={Loading} alt="Loading.." />
          <span className="font-bold mt-10">Enviando...</span>
        </LoadingWrapper>
      )}
      {created && (
        <ToastDialog
          title={message ?? ""}
          isOpen={true}
          handleOpen={handleChangeToast}
          handleClose={handleChangeToast}
        />
      )}
      <Formik
        initialValues={initialValues}
        validateOnChange={true}
        validateOnMount={true}
        onSubmit={async (values, { resetForm }) => {
          const phone =
            values.phone !== undefined
              ? values.phone.replace(/\D/g, "")
              : undefined;

          const document = isCPF
            ? values.cpf.replace(/\D/g, "")
            : values.cnpj.replace(/\D/g, "");

          const data = {
            pending: true,
            document,
            name: values.name,
            phone,
            email: values.email,
            cep: values.cep.replace(/\D/g, ""),
            street: values.street,
            number: values.number,
            neighborhood: values.neighborhood,
            city: values.city,
            itemsQuantity: Number(values.qtItems),
            purchaseValue: values.purchaseValue.toString().replace(".", ","),
          };

          await handleCreateTicket(data);
          resetForm();
        }}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          touched,
          errors,
          setErrors,
          setFieldValue,
        }) => (
          <>
            <FormItemWrapper
              className="
              flex-col 
              justify-start 
              items-start 
              min-w-fit 
              pb-[20px] 
              sm:mt-10 mt-10"
            >
              <FormItemWrapper className="sm:flex-row">
                <FormItemWrapper>
                  <FormItemWrapper className="flex-row">
                    <DocumentTypeSelect
                      label="CPF"
                      htmlFor="cpf"
                      checked={isCPF}
                      onChange={() => {
                        setFieldValue("cpf", "");
                        setIsCPF(true);
                      }}
                    />
                    <DocumentTypeSelect
                      label="CNPJ"
                      htmlFor="cnpj"
                      checked={!isCPF}
                      onChange={() => {
                        setFieldValue("cnpj", "");
                        setIsCPF(false);
                      }}
                    />
                  </FormItemWrapper>
                  <InputWrapper>
                    {isCPF ? (
                      <>
                        <InputMask
                          id="cpf"
                          className={maskedInputStyle}
                          value={values.cpf}
                          onBlur={async () => {
                            setFieldValue("cnpj", "0");

                            if (values.cpf.length === 14) {
                              const response = await validateDocument(
                                values.cpf
                              );

                              if (!response.valid) {
                                return setErrors({
                                  cpf: "CPF inválido",
                                  ...errors,
                                });
                              }
                            }
                          }}
                          onChange={handleChange("cpf")}
                          mask="999.999.999-99"
                          maskChar={null}
                        />
                      </>
                    ) : (
                      <>
                        <InputMask
                          id="cnpj"
                          className={maskedInputStyle}
                          value={values.cnpj}
                          onBlur={async () => {
                            setFieldValue("cpf", "0");

                            if (values.cnpj.length === 18) {
                              const response = await validateDocument(
                                values.cnpj
                              );
                              if (!response.valid) {
                                return setErrors({
                                  cnpj: "CNPJ inválido",
                                  ...errors,
                                });
                              }
                            }
                          }}
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
                      className={maskedInputStyle}
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
                      onBlur={async () => {
                        if (values.cep.length == 10) {
                          const address = await getAddressByCep(values.cep);

                          if (address !== null) {
                            setFieldValue("street", address.street, true);
                            setFieldValue("neighborhood", address.neighborhood, true);
                            setFieldValue("city", address.city, true);
                          }
                        }
                      }}
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
                    <label htmlFor="neighborhood" className="text-[.8rem] mb-2">
                      Bairro
                    </label>
                    <Input
                      className="sm:w-30 w-100"
                      id="neighborhood"
                      value={values.neighborhood}
                      onChange={handleChange("neighborhood")}
                      required
                    />
                  </InputWrapper>
                  {errors.neighborhood && touched.neighborhood && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.neighborhood}</ErrorText>
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
              <FormItemWrapper className="sm:flex-row items-start justify-between sm:w-full">
                <FormItemWrapper className="sm:w-40 sm:mr-10">
                  <InputWrapper>
                    <label htmlFor="qt-items" className="text-[.8rem] mb-2">
                      Quantidade de items do pedido
                    </label>
                    <InputMask
                      className={"sm:w-40" + maskedInputStyle}
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
                <FormItemWrapper>
                  <InputWrapper>
                    <label
                      htmlFor="purchaseValue"
                      className="text-[.8rem] mb-2"
                    >
                      Valor do pedido
                    </label>
                    <PrimeInputMaskNumber
                      inputStyle={{
                        backgroundColor: "#F2F2F2",
                        outline: 0,
                        maxWidth: 90,
                        borderRadius: 5,
                      }}
                      className="masked-number"
                      id="purchaseValue"
                      value={
                        Number(Number(values.purchaseValue).toFixed(2)) || null
                      }
                      mode="currency"
                      currency="BRL"
                      locale="pt-BR"
                      minFractionDigits={2}
                      maxFractionDigits={2}
                      onValueChange={(e) =>
                        setFieldValue("purchaseValue", e.target.value)
                      }
                      placeholder="R$ 0,00"
                      required
                    />
                  </InputWrapper>
                  {errors.purchaseValue && touched.purchaseValue && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.purchaseValue}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>
                <SubmitButton
                  className="sm:mr-2 sm:mt-7"
                  type="submit"
                  onClick={async () => {
                    handleSubmit();

                    if (isCPF && values.cpf.length === 14) {
                      const response = await validateDocument(values.cpf);

                      if (!response.valid) {
                        return setErrors({
                          cpf: "CPF inválido",
                          ...errors,
                        });
                      }
                    }

                    if (!isCPF && values.cnpj.length === 18) {
                      const response = await validateDocument(values.cnpj);

                      if (!response.valid) {
                        return setErrors({
                          cnpj: "CNPJ inválido",
                          ...errors,
                        });
                      }
                    }
                  }}
                >
                  Enviar
                </SubmitButton>
              </FormItemWrapper>
            </FormItemWrapper>
          </>
        )}
      </Formik>
    </Wrapper>
  );
};
