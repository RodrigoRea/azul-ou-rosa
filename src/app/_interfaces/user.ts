export interface IUser {
    id: number;
    descricao: string;
    loja_id: string;
    dominio: string; 
    cep: string; 
    nome: string; 
    fone1: string; 
    fone2: string; 
    fantasia: string;
    endereco: string; 
    email: string; 
    complemento: string; 
    estado: string; 
    cidade: string; 
    instagram: string;
    facebook: string; 
    pinterest: string; 
    youtube: string; 
    twitter: string;
    numero: string; 
    bairro: string; 
    concessionaria: string;
    cnpj: string;
    logo: string;
    categoria: number;
    categoria_alternativa: number;
    online: boolean;
    promocao: boolean;
    promocoes: any[];

    data_nasc: string;
    cpf: string;

}