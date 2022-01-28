$.fn.setMask = function(){ 
    // VMasker( $("ion-input.money-BRL").find('input') )   .maskMoney(); 

    VMasker( $(".dinheiro") )   .maskMoney();   
    VMasker( $(".c-cvv") )      .maskPattern('9999');
    VMasker( $(".c-cartao") )   .maskPattern('9999 9999 9999 9999 999');
    VMasker( $(".c-validade") ) .maskPattern('99/9999');
    VMasker( $(".decimal") )    .maskPattern('99');
    VMasker( $(".ano") )        .maskPattern('9999');
    VMasker( $(".calendario") ) .maskPattern('99/99/9999');
    VMasker( $(".telefone") )   .maskPattern('(99) 99999-9999');
    VMasker( $(".telfixo") )    .maskPattern('(99) 9999-99999');
    VMasker( $(".fone") )       .maskPattern('(99) 999999999');
    VMasker( $(".cep") )        .maskPattern('99999-999');
    VMasker( $(".cpf") )        .maskPattern('999.999.999-99');
    VMasker( $(".cnpj") )        .maskPattern('99.999.999/9999-99');
}