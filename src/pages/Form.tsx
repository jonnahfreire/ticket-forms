import { Formik } from "formik";

import { InputNumber as PrimeInputMaskNumber } from "primereact/inputnumber";
import InputMask from "react-input-mask";
import Loading from "../assets/loading.gif";

import {
  ErrorText,
  ErrorsWrapper,
  FormItemWrapper,
  InputWrapper,
  LoadingWrapper,
  SubmitButton,
  Wrapper,
  maskedInputStyle,
} from "./ClientForm";
import { useRef, useState } from "react";
import { DFFormValidationSchema } from "../validators";
import { DataProps, createTicket } from "../services/TicketService";
import { ToastDialog } from "../components/utils/Utilities";
import { useParams } from "react-router-dom";

export const Form = () => {
  const params = useParams();
  const [link, setLink] = useState<string | undefined>(undefined);
  const [created, setCreated] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [ticket, setTicket] = useState<DataProps | undefined>(undefined);
  const [defaultShippingTypes, setDefaultShippingTypes] = useState(true);

  const timerRef = useRef(0);

  function handleChangeToast() {
    setCreated(!created);
    timerRef.current = window.setTimeout(() => setCreated(false), 5000);

    return () => clearTimeout(timerRef.current);
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

      if (response.data) {
        setTicket(response.data);
        const { id } = response.data;
        const linkUrl = location.href.endsWith("/")
          ? `${location.href}client/${id}`
          : `${location.href}/client/${id}`;
        setLink(linkUrl);
      }
    }
  }

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
      {!isSubmiting && link === undefined && (
        <Formik
          initialValues={{
            itemsQuantity: "",
            purchaseValue: "",
            shipping: "",
            weight: "",
          }}
          validateOnChange={true}
          validateOnMount={true}
          onSubmit={async (values, { resetForm, setErrors }) => {
            const data = {
              weight: Number(values.weight)
                .toFixed(2)
                .toString()
                .replace(".", ","),
              purchaseValue: values.purchaseValue.toString().replace(".", ","),
              itemsQuantity: Number(values.itemsQuantity),
              shipping: values.shipping ?? null,
            };

            // if (values.shipping != "") {
            //   Object.defineProperty(data, "shipping", {
            //     value: values.shipping,
            //   });
            // }

            await handleCreateTicket(data);
            resetForm();
          }}
          validationSchema={DFFormValidationSchema}
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
              <FormItemWrapper className="min-w-fit items-center justify-between">
                <FormItemWrapper className="w-fit">
                  <InputWrapper className="sm:w-100">
                    <label
                      htmlFor="itemsQuantity"
                      className="text-[.8rem] mb-2"
                    >
                      Quantidade de items
                    </label>
                    <InputMask
                      className={"sm:w-100" + maskedInputStyle}
                      id="itemsQuantity"
                      value={values.itemsQuantity}
                      onChange={handleChange("itemsQuantity")}
                      mask="9999"
                      placeholder="0"
                      maskChar={null}
                      required
                    />
                  </InputWrapper>
                  {errors.itemsQuantity && touched.itemsQuantity && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.itemsQuantity}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>
                <FormItemWrapper className="">
                  <InputWrapper className="sm:w-100 justify-center">
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
                        borderRadius: 5,
                        width: "100%",
                      }}
                      className="rounded w-100 masked-number min-w-[292px] border-[#fff]"
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
                <FormItemWrapper className="">
                  <InputWrapper className="sm:w-100 justify-center">
                    <label htmlFor="weight" className="text-[.8rem] mb-2">
                      Peso
                    </label>
                    <PrimeInputMaskNumber
                      inputStyle={{
                        backgroundColor: "#F2F2F2",
                        outline: 0,
                        borderRadius: 5,
                        width: "100%",
                      }}
                      className="masked-number min-w-[292px] border-[#fff]"
                      id="weight"
                      value={Number(Number(values.weight).toFixed(2)) || null}
                      mode="decimal"
                      locale="pt-BR"
                      minFractionDigits={2}
                      maxFractionDigits={3}
                      onValueChange={(e) =>
                        setFieldValue("weight", e.target.value)
                      }
                      placeholder="Kg 0,00"
                      required
                    />
                  </InputWrapper>
                  {errors.weight && touched.weight && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.weight}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>
                <FormItemWrapper className="sm:w-100">
                  <InputWrapper className="sm:w-100">
                    <div
                      className="pr-3"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <label htmlFor="shipping" className="text-[.8rem] mb-2">
                        Tipo de envio
                      </label>
                      <label
                        className="text-[.8rem] mb-2 font-semibold cursor-pointer"
                        onClick={() =>
                          setDefaultShippingTypes(!defaultShippingTypes)
                        }
                      >
                        {defaultShippingTypes ? "Personalizado" : "Padrão"}
                      </label>
                    </div>
                    {defaultShippingTypes ? (
                      <select
                        className="min-h-[40px] max-w-[290px] outline-none border border-[#1B1D37] rounded p-2"
                        name="shipping"
                        id="shipping"
                        onChange={handleChange("shipping")}
                        value={values.shipping}
                      >
                        <option value="default">Selecione</option>
                        <option value="PAC">PAC</option>
                        <option value="SEDEX">SEDEX</option>
                        <option value="PEX">PEX</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="Transportadora"
                        className="min-h-[40px] max-w-[290px] outline-none border border-[#1B1D37] rounded p-2"
                        onChange={handleChange("shipping")}
                        value={values.shipping}
                      />
                    )}
                  </InputWrapper>
                  {errors.shipping && touched.shipping && (
                    <ErrorsWrapper>
                      <ErrorText>{errors.shipping}</ErrorText>
                    </ErrorsWrapper>
                  )}
                </FormItemWrapper>
                <FormItemWrapper className="items-center justify-start sm:w-100 min-w-[290px]">
                  <SubmitButton
                    className="sm:min-w-[290px] mr-2 mt-5"
                    type="submit"
                    onClick={() => handleSubmit()}
                  >
                    Gerar
                  </SubmitButton>
                </FormItemWrapper>
              </FormItemWrapper>
            </>
          )}
        </Formik>
      )}
      {link !== undefined && (
        <FormItemWrapper className="justify-between p-5 w-100 -mt-40">
          <FormItemWrapper className="sm:flex-row justify-between">
            <FormItemWrapper className="text-sm justify-center rounded-md w-50 h-[50px] bg-[#f2f2f2] shadow-lg mr-2 p-2">
              <label htmlFor="value" style={{ fontSize: ".8rem" }}>
                Valor
              </label>
              <span id="value" style={{ fontSize: ".7rem" }}>
                R${" "}
                {Number(ticket?.purchaseValue?.replace(",", "."))
                  .toFixed(2)
                  .replace(".", ",")}
              </span>
            </FormItemWrapper>
            <FormItemWrapper className="text-sm justify-center rounded-md h-[50px] bg-[#f2f2f2] shadow-lg mr-2 p-2">
              <label htmlFor="quantity" style={{ fontSize: ".8rem" }}>
                Quantidade
              </label>
              <span id="quantity" style={{ fontSize: ".7rem" }}>
                {ticket?.itemsQuantity}
              </span>
            </FormItemWrapper>
            <FormItemWrapper className="text-sm justify-center rounded-md h-[50px] bg-[#f2f2f2] shadow-lg mr-2 p-2">
              <label htmlFor="weight" style={{ fontSize: ".8rem" }}>
                Peso
              </label>
              <span id="weight" style={{ fontSize: ".7rem" }}>
                {ticket?.weight}
              </span>
            </FormItemWrapper>
            <FormItemWrapper className="text-sm justify-center rounded-md h-[50px] bg-[#f2f2f2] shadow-lg mb-5 p-2">
              <label htmlFor="shipping" style={{ fontSize: ".8rem" }}>
                Envio
              </label>
              <span id="shipping" style={{ fontSize: ".7rem" }}>
                {ticket?.shipping === null ? "N/A" : ticket?.shipping}
              </span>
            </FormItemWrapper>
          </FormItemWrapper>

          <SubmitButton
            onClick={async () => {
              navigator.clipboard.writeText(link);

              const success = await navigator.clipboard.readText();
              if (success == link) {
                setCopied(true);
              }
            }}
            className="items-center sm:w-100 mb-2 min-w-[290px] justify-center border-0 hover:bg-[#f2f2f2] rounded-md h-[50px] bg-[#f2f2f2] shadow-lg"
          >
            <FormItemWrapper className="items-center sm:w-100 mb-5 min-w-[290px] justify-center rounded-md h-[50px] bg-[#f2f2f2] shadow-lg">
              <span
                className="text-sm p-5 text-[#1B1D37] cursor-pointer"
                style={{ fontSize: ".8rem" }}
              >
                {link}
              </span>
            </FormItemWrapper>
          </SubmitButton>
          <FormItemWrapper className="flex items-end justify-end mb-5">
            {copied && (
              <span
                className="text-green-600 font-semibold"
                style={{ fontSize: ".7rem" }}
              >
                Copiado com sucesso!
              </span>
            )}
            {!copied && (
              <span style={{ fontSize: ".7rem" }}>
                Clique no link para copiar
              </span>
            )}
          </FormItemWrapper>
          <FormItemWrapper className="flex items-end cursor-pointer">
            <SubmitButton onClick={() => location.reload()}>
              Voltar
            </SubmitButton>
          </FormItemWrapper>
        </FormItemWrapper>
      )}
    </Wrapper>
  );
};
