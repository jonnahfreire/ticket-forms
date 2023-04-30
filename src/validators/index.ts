import * as yup from 'yup';


export const validationSchema = yup.object().shape({
    cnpj: yup.string().required("Informe um CNPJ"),

    cpf: yup.string().required("Informe um CPF"),

    name: yup.string().required("Informe seu nome completo"),
        
    phone: yup.string().optional(),
    
    email: yup.string().email('Informe um email válido')
    .required("Informe um email"),
    
    cep: yup.string().required("Informe seu CEP"),
    
    street: yup.string().required("Informe o nome da rua"),
    
    number: yup.string().required("Informe um número"),
    neighborhood: yup.string().required("Informe um bairro"),
    city: yup.string().required("Informe uma cidade"),
    complement: yup.string().optional(),
})

export const DFFormValidationSchema = yup.object().shape({
    shipping: yup.string().optional(),
    purchaseValue: yup.string().required("Informe um valor"),
    weight: yup.string().required("Informe o peso"),
    itemsQuantity: yup.string().required("Informe a quantidade de items"),
});