import * as yup from 'yup';


export const validationSchema = yup.object().shape({
    cnpj: yup.string().required("Insira um CNPJ válido"),

    cpf: yup.string().required("Por favor insira um CPF válido"),

    name: yup.string().required("Informe seu nome completo"),
        
    phone: yup.string().optional(),
    
    email: yup.string().email('Informe um email válido')
        .required("Informe um email"),

    cep: yup.string().required("Informe seu CEP"),

    street: yup.string().required("Informe o nome da rua"),

    number: yup.string().required("Informe um número"),
    bairro: yup.string().required("Informe um cairro"),
    city: yup.string().required("Informe uma cidade"),
    qtItems: yup.string().required("Informe a quantidade de items do pedido"),
})