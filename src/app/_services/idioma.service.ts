import { Injectable, EventEmitter} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class IdiomaService {
    
    language = new EventEmitter<any>();

    lg: number;
    idioma: string;
    text: any = [];
    meses: any = [];
    signos: any = [];
    strs: any = [];

    setLanguage(lg){
        this.setIdiomaLocal(lg);
        if(lg === 'pt-br'){
            this.lg = 0;
        }else if(lg === 'en'){
            this.lg = 1;
        }else if(lg === 'es'){
            this.lg = 2;
        }
        this.setTexts();
    }

    initLanguage(){
        this.idioma = localStorage.getItem('Language');
        console.log('idioma',this.idioma);
        if( this.idioma == null || this.idioma == 'undefined' ){
            this.setLanguage('pt-br');
        }else{
            this.setLanguage(this.idioma);
        }
        
    }

    setTexts(){
        this.textos();
        this.text = [];

        for(let key in this.strs){
            this.text[ key ] = this.strs[key][this.lg];
        } 
        console.log(this.text['home']);
        this.language.emit(this.text);
    }

    getTexts(){
        return this.text;
    }

    setIdiomaLocal(lg){
        localStorage.setItem('Language',lg);
    }

    getIdiomaLocal(){
        return this.idioma;
    }

    getMeses(){
        this.idioma = localStorage.getItem('Language');
        this.meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
        if( this.idioma === 'en' ){
            this.meses = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        }else if(this.idioma === 'es'){
            this.meses = [ 'Enero', 'Julio', 'Marzo', 'April', 'mayo', 'Julio', 'Julio', 'Septiembre', 'septiembre', 'October', 'de noviembre', 'de diciembre'];
        }

        return this.meses;
    }

    getSignos(){
        this.idioma = localStorage.getItem('Language');
        this.signos = ['Áries','Touro','Gêmeos','Câncer','Leão','Virgem','Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes'];
        if( this.idioma === 'en' ){
            this.signos = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
        }else if(this.idioma === 'es'){
            this.signos = [ 'Aries','toro','Gemini','cáncer','león','virgen','libra','Scorpions','Libra','Capricornio','acuario','Fish'];
        }

        return this.signos;
    }

    textos(){
        // indexs
        // 0 = pt-br
        // 1 = en

        this.strs = [];

        this.strs['app-name']     = ['Azul ou Rosa','Blue or Pink','Azul o Rosa'];
        this.strs['menino']     = ['Menino','Boy','Chico'];
        this.strs['menina']     = ['Menina','Girl','Niña'];
        
        this.strs['home']     = ['Home','Home','Home'];
        this.strs['calculos'] = ['Cálculos','Calculations','Cálculos'];
        this.strs['dicas']    = ['Dicas','Tips','Consejos'];
        this.strs['idioma']   = ['Idioma','Language','Idioma'];
        
        this.strs['sobre']    = ['Sobre o app','About the app','Acerca de la aplicación'];
        this.strs['sobre-txt-1']    = ['Este aplicativo é para fins de entretenimento.','This app is for entertainment purposes.','Esta aplicación es para fines de entretenimiento.'];
        this.strs['sobre-txt-2']    = ['Todas as informações e cálculos neste aplicativo não garantem um resultado autêntico.','All information and calculations in this application do not guarantee an authentic result.','Todas las informaciones y cálculos en esta aplicación no garantizan un resultado auténtico.'];
        this.strs['sobre-txt-3']    = ['Utilize este aplicativo com conciência e para resultados conclusivos procure uma clínica especializada ou consulte seu médico!','Use this application with awareness and for conclusive results. Find a specialist clinic or consult your doctor!','¡Utilice esta aplicación con conciencia y para resultados concluyentes busque una clínica especializada o consulte a su médico!'];
        this.strs['sobre-txt-4']    = ['Parabéns por sua gravidez.','Congratulations on your pregnancy.','felicitaciones para usted'];
        
        this.strs['portugues'] = ['Português','Portuguese','Portugués'];
        this.strs['ingles']    = ['Inglês','English','Inglés'];
        this.strs['espanhol']  = ['Espanhol','Spanish','Español'];

        this.strs['batimentos'] = ['Batimentos cardíacos','Heart beats','Latidos cardiacos'];
        this.strs['batimentos-txt'] = ['Acredita-se que, se o coração do bebê bate mais de 140 vezes por minuto é uma menina, se o faz menos, é um menino.','It is believed that if the baby\'s heart beats more than 140 times a minute is a girl, if it does less, it is a boy.','Se cree que si el corazón del bebé golpea más de 140 veces por minuto es una niña, si lo hace menos, es un niño.'];

        this.strs['couve'] = ['Teste da couve-roxa','Cauliflower test','Prueba de la coliflor'];
        this.strs['couve-txt'] = ['Ferva uma couve, guarde a água da cozedura e misture-lhe umas gotas da sua urina. Se a água adquirir um tom roxo, terá um menino, mas se ficar rosada, terá uma menina.','Boil a cabbage, save the cooking water and mix a few drops of your urine. If the water turns purple, it will have a boy, but if it turns pink, it will have a girl.','Ferva una col, guarde el agua de la cocción y mezcle unas gotas de su orina. Si el agua toma un tono morado, tendrá un niño, pero si se pone rosada, tendrá una niña.'];
        
        this.strs['laco'] = ['Laço','Tie','Bucle'];
        this.strs['laco-txt'] = ['Este truque consiste em atar um fio em volta de um anel, significativo para si, e deitar-se. Em seguida deve pedir ao seu companheiro, a um familiar, ou a uma amiga, que suspendam o anel pelo fio sobre a sua barriga. Se o anel balançar de um lado para o outro, como um pêndulo, terá um menino. Pelo contrário, se ele girar em movimentos concêntricos será uma menina.','This trick consists in tying a cord around a ring, meaningful to you, and lying down. Then you should ask your partner, a family member, or a friend to suspend the ring by the thread on your belly. If the ring sways from side to side, like a pendulum, it will have a boy. On the contrary, if it spins in concentric motions it will be a girl.','Este truco consiste en atar un hilo alrededor de un anillo, significativo para sí, y acostarse. En seguida debe pedir a su compañero, a un familiar, oa una amiga, que suspendan el anillo por el hilo sobre su vientre. Si el anillo se balancea de un lado a otro, como un péndulo, tendrá un niño. Por el contrario, si gira en movimientos concéntricos será una niña.'];

        this.strs['temperatura'] = ['A temperatura dos pés','The temperature of the feet','La temperatura de los pies'];
        this.strs['temperatura-txt'] = ['Este método tão simples consiste em estar atenta, durante a gravidez, ao facto de ter os pés gelados. Se assim for, significa que espera um menino, se os sentir quentes, será uma menina.','This simple method consists in being careful, during pregnancy, to have the feet frozen. If so, it means that expects a boy, if they feel warm, it will be a girl.','Este método tan simple consiste en estar atenta, durante el embarazo, al hecho de tener los pies helados. Si es así, significa que espera a un niño, si los siente calientes, será una niña.'];

        this.strs['home-txt-1'] = ['Prepare-se para descobrir se seu bebê é menino ou menina','Get ready to find out if your baby is a boy or a girl','Prepárese para descubrir si su bebé es niño o niña'];

        this.strs['convites'] = ['Convites','Invitations','Invitaciones'];
        
        this.strs['calgravidez'] = ['Signo do bebê','Baby sign','Signo de bebe'];
        this.strs['calgravidez-txt-1'] = ['Calcula a data apróximada em que o bebê pode nascer. Podendo prever até o signo do bebê!','Calculate the approximate time the baby can be born. Can even predict the baby sign!','Calcula el plazo aproximado en que el bebé puede nacer. ¡Podrá predecir hasta el signo del bebé!'];
        this.strs['calgravidez-txt-2'] = ['Data do primeiro dia da ultima menstruação','Date of first day of last menstruation','Fecha del primer día de la última menstruación'];
        this.strs['calgravidez-txt-3'] = ['Dia de início','Start day','Día de inicio'];
        this.strs['calgravidez-txt-4'] = ['Mês','Month','Mes'];
        this.strs['calgravidez-txt-5'] = ['Ano','Year','Año'];

        this.strs['numerologia'] = ['Numerologia','Numerology','Numerología'];
        this.strs['numerologia-txt-1'] = ['Idade da mamãe e do papai quando engravidaram!','Age of Mom and Dad when they got pregnant!','¡Edad de mamá y papá cuando se quedaron embarazadas!'];
        this.strs['numerologia-txt-2'] = ['Idade da mamãe quando engravidou!','Mom\'s age when she got pregnant!','¡Edad de la mamá cuando se quedó embarazada!'];
        this.strs['numerologia-txt-3'] = ['Idade do papai quando engravidou!','Daddy\'s age when he got pregnant!','¡La edad de papá cuando se quedó embarazada!'];
        this.strs['numerologia-txt-4'] = ['A idade dos pais são utilizadas neste cálculo. Somando a idade da mamãe com a do papai no momento da gravidez.','The age of the parents is used in this calculation. Adding Mom\'s age to Dad\'s at the time of pregnancy.','La edad de los padres se utiliza en este cálculo. Sumando la edad de la mamá con la de papá en el momento del embarazo.'];

        this.strs['chinesa'] = ['Tabela chinesa','Chinese table','Tabla china'];
        this.strs['chinesa-txt-1'] = ['A idade deve ser entre 18 e 45 anos!','The age must be between 18 and 45 years!','La edad debe ser entre 18 y 45 años.'];
        this.strs['chinesa-txt-2'] = ['Mês em que a mamãe faz aniversário','Month in which Mom makes birthday','Mes en que la mamá hace cumpleaños'];
        this.strs['chinesa-txt-3'] = ['Mês em que a mamãe ficou grávida','Month in which the mother became pregnant','Mes en que la mamá quedó embarazada'];
        this.strs['chinesa-txt-4'] = ['Idade da mamãe quando engravidou!','Mom\'s age when she got pregnant!','¡Edad de la mamá cuando se quedó embarazada!'];
        this.strs['chinesa-txt-5'] = ['Essa tabéla é uma lenda chinesa e teria sido encontrada no século XIV.','This table is a Chinese legend and would have been found in the 14th century.','Esta mesa es una leyenda china y habría sido encontrada en el siglo XIV.'];

        this.strs['maia'] = ['Tabela maia','Mayan Table','Tabla maya'];
        this.strs['maia-txt-1'] = ['A idade deve ser entre 15 e 40 anos!','The age must be between 15 and 40 years!','La edad debe ser entre 15 y 40 años!'];
        this.strs['maia-txt-2'] = ['Mês em que o bebê irá nascer','Month the baby will be born','Mes en el que el bebé nacer'];
        this.strs['maia-txt-3'] = ['Idade da mamãe quando ficou grávida','Mom\'s age when she became pregnant','Edad de la mamá cuando se quedó embarazada'];
        this.strs['maia-txt-4'] = ['A versão maia baseia-se nas fases da lua.','The Mayan version is based on the phases of the moon.','La versión maya se basa en las fases de la luna.'];

        this.strs['cigana'] = ['Cigana','Gipsy','Citano'];
        this.strs['cigana-txt-1'] = ['Qualquer idade!','Any age!','¡Cualquier edad!'];
        this.strs['cigana-txt-2'] = ['Mês em que a mamãe engravidou','Month when mom got pregnant','Mes en el que la mamá se quedó embarazada'];
        this.strs['cigana-txt-3'] = ['Idade da mamãe quando ficou grávida','Mom\'s age when she became pregnant','Edad de la mamá cuando se quedó embarazada'];
        this.strs['cigana-txt-4'] = ['Cálculo apenas sobre a data e idade da mãe','',''];

        this.strs['resultado'] = ['Resultado','Result','Resultado'];
        this.strs['resultado-txt-1'] = ['Parabéns, acho que vai ser um menino','Congratulations, I think it\'s going to be a boy.','Enhorabuena, creo que va a ser un niño'];
        this.strs['resultado-txt-2'] = ['Parabéns, acho que vai ser uma menina','Congratulations, I think it\'s going to be a girl.','Enhorabuena, creo que va a ser una niña'];

        this.strs['btn-calcular'] = ['Calcular','Calculate','Calcular'];
        this.strs['btn-start'] = ['Começar','Begin','Comienzo'];
        this.strs['btn-voltar-calculo'] = ['Fazer outro cálculo','Do another calculation','Hacer otro cálculo'];

        this.strs['data'] = ['no dia {dd} de {mm} de {yy}','on {mm} {dd}, {yy}','el {dd} de {mm} de {yy}'];
        this.strs['provavelmente'] = ['O nascimento do bebê será próximo da data:','The birth of the baby will be close to the date:','El nacimiento del bebé será cerca a la fecha:'];
        
        this.strs['info-cientifico'] = ['Este método não está comprovado cientificamente','Este método no está científicamente probado.','This method is not scientifically proven.']
        this.strs['info-all-cientifico'] = ['Todos os métodos não são comprovados cientificamente. Os métodos aqui presentes são apenas meios utilizados por cada cultura e não podem ser comprovados.','All methods are not scientifically proven. The methods presented here are only media used by each culture and cannot be proven.','No todos los métodos están científicamente probados. Los métodos presentados aquí son solo medios utilizados por cada cultura y no se pueden probar.']
    
        this.strs['convites'] = ['Convites','Invitaciones','Invitations'];
        this.strs['cha-revelacao'] = ['Chá revelação','Revelation tea','Té de revelación'];
        this.strs['cha-revelacao-txt'] = ['Para descobrir se o bebê será um menino ou uma menina de uma forma bem animada e criativa para a família e os amigos! Muitas vezes os pais também só ficam sabendo na hora da revelação, assim a surpresa é para todos.','¡Para saber si el bebé será niño o niña de una manera muy animada y creativa para familiares y amigos! A menudo, los padres también solo se enteran en el momento de la revelación, por lo que la sorpresa es para todos.','To find out if the baby will be a boy or a girl in a very lively and creative way for family and friends! Often parents also only find out at the time of the revelation, so the surprise is for everyone.'];

        this.strs['cha-fraldas'] = ['Chá de fraldas','Bienvenida al bebé','Baby shower'];
        this.strs['cha-fraldas-txt'] = ['O chá de fraldas se torna uma alternativa para focar mais em receber fraldas como presente para o bebê.','El baby shower se convierte en una alternativa para enfocarse más en recibir pañales como regalo para el bebé.','The baby shower becomes an alternative to focus more on receiving diapers as a gift for the baby.'];
    }

    private refreshLanguageSubject = new Subject<any>();
    refreshLanguageState = this.refreshLanguageSubject.asObservable();
    toRefreshLanguage(lg: string){
        this.setLanguage(lg);
        this.refreshLanguageSubject.next( this.getTexts() );
    }

}