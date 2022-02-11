export class Produto {
    valor: number;
    nome: string;
    idproduto: number;
    imagem: string;
}

export class ResponsePG {
    Status: number;
    Mensagem: string;
    Dados: any;
}

export class PGMethods {
    error: false
    paymentMethods: Array<any>;
}

export class PGMethodsSub {
    code: number;
    name: string;
    options: any;
}

export class Metodos {
    code: number;
    displayName: string;
    images: any;
    name: string;
    status: string;
}

export class Bin {
    bin: number;
    brand: Brand;
    cardLeve: string;
    cvvSize: number;
    expirable: string;
    validationAlgorithm: string;
}

export class Brand {
    name: string;
}

export class SafeCheckoutResponse{
    status: string;
    code: number;
    message: Token;
    result: Token;
}

export class Token {
    token: string;
}

export class PG{
  hash: string;
  idproduto: number;
	idsession: string;
	cardToken: string;
  dados: Dados;
  pagamento: Cartao;
}

export class Dados {
    nome: string;
    sobrenome: string;
    email: string;
    tipodoc: string;
    CPF: string;
    CNPJ: string;
    mensagem: string;
    quantidade: number;
    idproduto: string;
    valor: number;
    telefone: string;
    dtnascimento: string;
    voltar: boolean;
}

export class Cartao{
    cardnumber: string;
    name: string;
    cvv: string;
    valid: string;
    installments: string;
    brand: string;
    banco: string;
    tipo: string;
    token: string;
    valorparcelado: number;
}


export class RetornoPG{
    referencia: string;
    valor: number;
    boleto: string;
    mensagem: string;
    link: string;
    status: number;
}