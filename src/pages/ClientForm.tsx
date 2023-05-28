import { useEffect, useRef, useState } from "react";
import tw from "tailwind-styled-components";

import InputMask from "react-input-mask";
import "../components/utils/maskedNumberInputStyle.css";

import { Formik } from "formik";

import Loading from "../assets/loading.gif";
import { ToastDialog } from "../components/utils/Utilities";
import { validationSchema } from "../validators";
import {
  DataProps,
  getTicketById,
  updateTicket,
  validateDocument,
} from "../services/TicketService";
import { useParams } from "react-router-dom";
import { routes } from "../constants";

export const Wrapper = tw.div`
  flex flex-1
  flex-col
  items-center
  justify-center
  w-screen h-screen
  p-0 m-0
`;

export const LoadingWrapper = tw(Wrapper)`
  mt-0
  relative
  w-full h-full
  bg-indigo-100/[0.7]
`;

export const InputWrapper = tw.div`
    flex
    flex-col
    justify-between
    mb-2
    w-[300px]
    sm:w-100
`;

export const FormItemWrapper = tw.div`
    flex
    flex-col
`;

export const Input = tw.input`
    flex-1 
    pl-2 mr-2
    min-h-[40px]
    text-sm 
    bg-[#F2F2F2] 
    outline-0 
    border border-[#1B1D37] rounded
`;

export const SubmitButton = tw.button`
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

export const ErrorsWrapper = tw.div`
    w-100
    flex-start
    justify-center
`;

export const ErrorText = tw.span`
    text-left 
    text-[#dc2626]
    text-[.7rem]
    font-bold
`;

export const maskedInputStyle = `
    flex-1 
    pl-2 mr-2
    min-h-[40px]
    text-sm 
    bg-[#F2F2F2] 
    outline-0 
    border border-[#1B1D37] rounded
`;

export const cepInpuStyle = maskedInputStyle + "sm:w-[200px]";

export interface DocumentTypeSelectProps {
  checked: boolean;
  onChange: (e: any) => void;
  label: string;
  htmlFor: string;
  placeholder?: string;
}
export const DocumentTypeSelect = ({
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

interface ClientFormViewProps {
  isAdmView?: boolean;
}

export const ClientForm = ({ isAdmView }: ClientFormViewProps) => {
  const params = useParams();
  const [isCPF, setIsCPF] = useState(true);
  const [created, setCreated] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [tickedFilled, setTickedFilled] = useState(false);
  const [tickedFound, setTickedFound] = useState(true);
  const [ticket, setTicket] = useState<DataProps>();

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

  async function handleUpdateTicket(data: DataProps) {
    setIsSubmiting(true);
    const response = await updateTicket(params.id!, data);

    if (response.code === 200) {
      setIsSubmiting(false);
      setTimeout(() => {
        setMessage(response.message);
        handleChangeToast();
      }, 1000);

      setTimeout(() => {
        location.reload();
      }, 1500);
    } else {
      setIsSubmiting(false);
      setTickedFound(false);
    }
  }

  useEffect(() => {
    if (params.id !== undefined) {
      getTicketById(params.id).then((response) => {
        const ticket = response;
        setTicket(ticket);

        if (response !== null && Object.keys(response).includes("error")) {
          setTickedFound(false);
        }

        if (!Object.keys(response).includes("error") && !isAdmView) {
          response !== null && setTickedFilled(ticket.filled!);
          response === null && setTickedFound(false);
        }
      });
    }
  }, []);

  return (
    <Wrapper className="mt-10">
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
      {tickedFilled && !isSubmiting && (
        <>
          <div className="flex items-center justify-center bg-green-200 p-10 rounded-lg">
            <span className="font-bold text-[#454545]">
              Obrigado! Você já enviou este formulário.
            </span>
          </div>
        </>
      )}
      {!tickedFound && !isSubmiting && (
        <>
          <div className="flex items-center justify-center bg-red-200 p-10 rounded-lg">
            <span className="font-bold text-[#454545]">
              Dados não encontrados.
            </span>
          </div>
        </>
      )}
      {!isSubmiting && !tickedFilled && tickedFound && ticket !== undefined && (
        <Formik
          initialValues={{
            cpf: ticket?.document?.length === 11 ? ticket.document : "",
            cnpj: ticket?.document?.length === 14 ? ticket.document : "",
            name: ticket?.name || "",
            phone: ticket?.phone || "",
            email: ticket?.email || "",
            cep: ticket?.cep! || "",
            street: ticket?.street || "",
            number: ticket?.number || "",
            neighborhood: ticket?.neighborhood || "",
            city: ticket?.city || "",
            complement: ticket?.complement || "",
          }}
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
              filled: true,
              document,
              name: values.name,
              phone,
              email: values.email,
              cep: values.cep.replace(/\D/g, ""),
              street: values.street,
              number: values.number,
              neighborhood: values.neighborhood,
              city: values.city,
              complement: values.complement,
            };

            if (values.complement !== "") {
              Object.defineProperty(data, "complement", {
                value: values.complement,
              });
            }

            await handleUpdateTicket(data);
            console.log(data);
            resetForm();
          }}
          validationSchema={isAdmView ? null : validationSchema}
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
                            placeholder="999.999.999-99"
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
                            mask="99.999.999/9999-99"
                            placeholder="99.999.999/9999-99"
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
                        placeholder="(99) 99999-9999"
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
                              setFieldValue(
                                "neighborhood",
                                address.neighborhood,
                                true
                              );
                              setFieldValue("city", address.city, true);
                            }
                          }
                        }}
                        placeholder="00000-000"
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
                        Logradouro
                      </label>
                      <Input
                        className="sm:flex-1"
                        id="rua"
                        value={values.street}
                        onChange={handleChange("street")}
                        placeholder="Avenida, rua etc"
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

                <FormItemWrapper className="flex-col ">
                  <FormItemWrapper className="sm:flex-row">
                    <FormItemWrapper>
                      <InputWrapper>
                        <label
                          htmlFor="neighborhood"
                          className="text-[.8rem] mb-2"
                        >
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

                  <FormItemWrapper className="sm:flex-row items-end justify-between sm:w-full">
                    <FormItemWrapper>
                      <InputWrapper>
                        <label
                          htmlFor="complement"
                          className="text-[.8rem] mb-2"
                        >
                          Complemento
                        </label>
                        <Input
                          className="sm:w-70 w-100"
                          id="complement"
                          value={values.complement}
                          onChange={handleChange("complement")}
                          placeholder="Ex. Apto, Casa"
                          required
                        />
                      </InputWrapper>
                      {errors.complement && touched.complement && (
                        <ErrorsWrapper>
                          <ErrorText>{errors.complement}</ErrorText>
                        </ErrorsWrapper>
                      )}
                    </FormItemWrapper>
                    {/* ENDEREÇO */}

                    {isAdmView && (
                      <FormItemWrapper className="mb-2">
                        <button className="bg-[#1b1d37] p-2 rounded">
                          <a href={routes.tickets} className="text-white">
                            Voltar
                          </a>
                        </button>
                      </FormItemWrapper>
                    )}

                    <SubmitButton
                      className="sm:mr-2 mb-2 sm:w-100"
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
                      {isAdmView ? "Atualizar" : "Enviar"}
                    </SubmitButton>
                  </FormItemWrapper>
                </FormItemWrapper>
              </FormItemWrapper>
            </>
          )}
        </Formik>
      )}
    </Wrapper>
  );
};
