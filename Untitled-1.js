//url de origem dos assetss
// var origin_url = ".";                           //Local
// var origin_url = "";                          //TESTE CONFIG
// var origin_url = '//10.150.6.24/livelo_chat';     //PROD 1
// var origin_url = '//www-uat.pontoslivelo.com.br/livelo_chat';   //HOMOL
var origin_url = '//www.pontoslivelo.com.br/livelo_chat';   //PROD
// var origin_url = '//35.231.21.246:8080'; // DEV

//endpoint do broker
//var broker_endpoint = '//10.150.6.17:8080/conversations/';    //PROD 1
var broker_endpoint = 'https://www.pontoslivelo.com.br/conversations/';  //PROD
// var broker_endpoint = "";   //TESTE CONFIG
// var broker_endpoint = 'https://www-uat.pontoslivelo.com.br/conversations/';  //HOMOL
// var broker_endpoint = '//35.196.226.28:8080/conversations/'; //DEV
//  var broker_endpoint = 'http://localhost:8080/conversations/'; //DEV

//codigo do chat executado depois que carregou os elementos
function chatLiveloJQueryCode() {

  'use strict';

  //carrega os estilos do chat
  $('head').append('<link rel="stylesheet" type="text/css" href="' + origin_url + '/css/styles.css" />');
  $('head').append('<link rel="stylesheet" type="text/css" href="https://afeld.github.io/emoji-css/emoji.css" />');
  $('head').append('<link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />');
  //carrega script de tagueamento
  //$('head').append('<script>window.dataLayer = window.dataLayer || []; window.dataLayer = [{}];</script>');

  //variaveis globais
  var chatbot_active = false;
  var globalDialogue = [];
  var sendInputAble = true;
  var receivemessage = new Audio(origin_url + '/assets/sounds/receivemessage.mp3');
  var sentmessage = new Audio(origin_url + '/assets/sounds/sentmessage.mp3');
  var createChat = true; //para o chat ser construido apenas umas vez
  var human_layout = true; //para transformar para versão atendente apenas uma vez
  var send_email_layout = true;
  var cancel_layout = true;
  var troca_layout = true;
  var flash = false;
  var nmsguser = 0;
  var resolvefacilbot = false;
  var resgatebraseguros = false;
  // var evaluation_layout = true;
  var form_next_action = false;
  var createChatNPS=true;
  var nps_layout=true;
  var zerarcontador = false;
  var npssemvoto = false;
  //respostas
  var global_gifjson = {
    'answers': [{
      'text': '<img id="chatTypingGif" src="' + origin_url + '/assets/icons/typing.gif" />'
    }],
    'technicalText': 'loading'
  };
  var global_errorMsg = {
    'answers': [
      {
        'text': '<p>Eita, deu ruim... <i class="em em-grimacing"></i></p><br><p>Enquanto resolvemos esse probleminha técnico por aqui, você pode fazer suas trocas, transferências e ver seus pedidos, tudo lá no app da Livelo.</p><br><p>Nós também estamos à disposição todos os dias, das 7h às 23h, nos telefones abaixo:</p><br><p>3004-8858 (Capitais e regiões metropolitanas)<br>0800-757-8858 (demais regiões)</p>'
      }
    ]
  };

  var userIp = '127.0.0.1';

  $(function() {
    $.getJSON("https://api.ipify.org?format=jsonp&callback=?",
      function(json) {
        if (json.ip != undefined && json.ip != ""){
          userIp = json.ip;
        } else {
          userIp = '127.0.0.1'
        }
        

      }
    );
  });


  //icons
  var livelo_chat_icon_chat_blue = origin_url + '/assets/icons/menu-chat.svg';
  var livelo_chat_icon_chat_white = origin_url + '/assets/icons/inverse-chat.svg';
  var livelo_chat_icon_like_unselect = origin_url + '/assets/icons/like-Unselected.svg';
  var livelo_chat_icon_like_select = origin_url + '/assets/icons/like-Selected.svg';
  var livelo_chat_icon_dislike_unselect = origin_url + '/assets/icons/dislike-Unselected.svg';
  var livelo_chat_icon_dislike_select = origin_url + '/assets/icons/dislike-Selected.svg';

  //ajax header
  var broker_headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'API-KEY': '771fc720-b23c-11e6-80f5-76304dec7eb7',
    'PROJECT': 'Livelo',
    'CHANNEL': 'Chat',
    'OS': 'Windows',
    'LOCALE': 'pt-BR',
    'USER-REF': '127.0.0.1'//TODO:IP DO USUARIO! NÃO FIXO
  };

  //lastSessionCode
  var lastSessionCode = '';
  function setLastSessionCode(value) { lastSessionCode = value; }
  function getLastSessionCode() { return lastSessionCode; }

  //sessionCode
  var sessionCode = '';
  function setSessionCode(value) { sessionCode = value; }
  function getSessionCode() { return sessionCode; };

  if (document.getElementsByClassName("chatbotever")[0]==undefined){
    var originchannel = getParameterByName('originchannel');
  } else {
  var tag=document.getElementsByClassName("chatbotever")[0].src;

  // var variaveis=tag.substr(tag.indexOf("originchannel")+14);
  // var v1 = variaveis.substr(0,1);
  // var originchannel=v1;

  var variaveis=tag.substr(tag.indexOf("originchannel")+14);
  var aux = variaveis.substr(0,1);
  if (aux == 0){
    var v1 = variaveis.substr(0,2);
  } else {
  var v1 = variaveis.substr(0,1);
  }
  var originchannel=v1;

}

  var LiveloBuildMenu = function () {

    var logo = $('<img>').addClass('gtm-element-event')
      .attr({
        'data-gtm-event-category': 'pontoslivelo:geral',
        'data-gtm-event-action': 'click:ajuda-flutuante',
        'data-gtm-event-label': 'principal:abrir',
        // 'data-gtm-dimension35' : sessionCode,
        'src': origin_url + '/assets/icons/IconBot_5x.png',
        'id': 'chat-livelo-logo'
      })
      .css({'height':'58px','width':'58px'})
      var width = $(window).width();
      if (width>=769){
        logo.css({'opacity':'0'});
      }

    var logowrap = $('<div>').addClass('lv-chatbox-menu-logo')
      .append(logo)
      .click(buildHtmlChat);
      
      var div_fraase2 = $('<div>').css({'padding':'0px 0px 0px 25px','display':'flex'})
      var img_check = $('<img>')
      .attr({ 'src': origin_url + '/assets/icons/check.svg' })
      .attr({ 'id': 'img_check' })
      .css({'margin':'0'});
      if (width >= 769) {
        var logoOpen = $('<div>').addClass('lv-chatbox-menu-logo-open')
      .append('<p class="lv-chatbox-menu-logo-open-parag-azul">Precisa de ajuda?</p>')
      div_fraase2.append(img_check)
      div_fraase2.append('<p class="lv-chatbox-menu-logo-open-parag-rosa">Fale com a Livelo pelo chat</p>');
      logoOpen.append(div_fraase2);
      
      // alert(originchannel + ' é um ' + typeof(originchannel));
      }

    function canIHelpYouTag() {
      var width = $(window).width();
      if (width >= 769) {
      setTimeout(function () { //animacçao do botao
        $('p.lv-chatbox-menu-logo-open-parag').fadeOut();
        $('div.lv-chatbox-menu-logo-open')
        .addClass('lv-chatbox-menu-logo-open-anima')
        $('.lv-chatbox-menu-logo-open-parag-azul').fadeOut();
        $('.lv-chatbox-menu-logo-open-parag-rosa').fadeOut();
        $('#img_check').fadeOut();
      }, 3000);
      setTimeout(function () { //ajuste do sombreamento depois da animação
        // $('div.lv-chatbox-menu-logo').css({
        //   "box-shadow": "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3)"
        // });
        // $('div.lv-chatbox-menu-logo-open').css({
        //   // "border":"none"
        // })
        $('#chat-livelo-logo').css({
          'opacity':'1'
        })
      }, 3500);
    }
  }

    var html = $('<div>').addClass('lv-chatbox-menu')
      .addClass('lv-chatbox-menu-visible')
      if (originchannel==3 || originchannel==4){
      html.append(buildHtmlChat)
      } else {
      html
      .append(logowrap)
      .append(logoOpen)
      .append(canIHelpYouTag());
      }

    var position = $('#livelo-everis-chat').attr('position');
    if (position) {
      html.attr({ 'position': position })
    };
    return html;
  }

  var hideChat = (function () {
    'use strict'
    function hideChat() {
      zerarcontador=false;
      $('.lv-chatbox').removeClass('lv-chatbox-visible');
      $('.lv-chatbox-menu').addClass('lv-chatbox-menu-visible');
      $('#chat-livelo-logo').attr({ 'src': origin_url + '/assets/icons/IconBot_5x.png' })
      .css({'height':'58px','width':'58px'});
    }
    return hideChat;
  })();

  var LiveloBuildChatHeader = function () {
    var imgLogo = $('<img/>').attr({ 'src': origin_url + '/assets/icons/pink.svg' })
      .addClass('lv-chatbox-logotipo');
    var imgClose = $('<img/>').attr({ 'src': origin_url + '/assets/icons/btn-Close.svg' })
      .addClass('lv-chatbox-closebtn')
      .addClass('gtm-element-event')
      .attr({
        'data-gtm-event-category': 'pontoslivelo:geral',
        'data-gtm-event-action': 'click:ajuda-flutuante',
        'data-gtm-dimension35' : sessionCode,
        'data-gtm-event-label': 'principal:fechar'
      })
      // .click(hideChat);
      imgClose.click(LiveloBuildChatNPScall);
      
    var imgMin = $('<img/>').attr({ 'src': origin_url + '/assets/icons/minus.svg' })
      .addClass('lv-chatbox-closebtn')
      .addClass('gtm-element-event')
      .attr({'id':'minimizar'})
      .css({'right':'38px','top':'17px'})
      .click(hideChat);
    var inner = $('<div>').addClass('inner')
      .append(imgLogo)
      .append('<p id="atendimentoLivelo">Atendimento Livelo</p>')
      .append(imgMin)
      .append(imgClose)
    var html = $('<div>').addClass('lv-chatbox-header')
      .append(inner)
      .attr({'id':'chat_header'});
    return html;
  }

  var LiveloBuildChatHeaderNPS = function () {
    var imgLogo = $('<img/>').attr({ 'src': origin_url + '/assets/icons/pink.svg' })
      .addClass('lv-chatbox-logotipo');
      var imgClose = $('<img/>').attr({ 'src': origin_url + '/assets/icons/btn-Close.svg' })
      .addClass('lv-chatbox-closebtn')
      .addClass('gtm-element-event')
      .attr({'id':'fecharnps'})
      .click(closeNPSwithoutVote);
    var inner = $('<div>').addClass('inner')
      .append(imgLogo)
      .append('<p id="atendimentoLivelo">Atendimento Livelo</p>')
      .append(imgClose)
    var html = $('<div>').addClass('lv-chatbox-header')
      .append(inner)
      .attr({'id':'chat_header_NPS'});
    return html;
  }

  var LiveloBuildChatNPScall = function(){
    // console.log(nmsguser)
    if(nmsguser<=1){
      closeNPSwithoutVote();
    } else {
    $('#lv-chatbox-body-messages').css({'opacity':'0.3'})
    $('#form_bot').css({'opacity':'0.3'})
    $('#msg_to_send').attr({'disabled':'true'})
    $('#chat_header').css({'opacity':'0.3'})
    if (nps_layout == true){
    LiveloBuildChatNPS().insertAfter($('#lv-chatbox-body-messages'));
    nps_layout=false;
    }
    }
  }


  var LiveloBuildChatNPS = function(){
    var html = $('<div>');
    var div_border = $('<div>').css({'height': '98%','width': '95%','margin':'auto','border-radius': '3px'})
    .attr({'id':'div_border'})
    var div_borderfilho = $('<div>').css({'padding':'15px','padding-top':'70px'})
    .attr({'id':'div_borderfilho'})
    // var icon = $('<img/>').addClass('lv-msg-icon-livelo')
    //       .attr({ 'src': origin_url + '/assets/icons/livelo.png', 'id':'NPS_logo' })
    //       .css({'left': '38%','top': '0%'});
    var parag = $('<p>')
    parag.append('Pensando na experiência com esse canal, o quanto você recomendaria a Livelo para um amigo ou familiar?')
    .css({'text-align': 'left','font-size': '14px'});
    var parag_motivo = $('<p>')
    parag_motivo.append('Me explica o motivo da sua nota?')
    .css({'text-align': 'left','font-size': '14px','padding':'0px 15px 0px'});
    var vote = $('<div>').addClass('vote');
    var square0 = $('<label>').addClass('square_nps')
    .attr({'for':'0'});
    var square1 = $('<label>').addClass('square_nps')
    .attr({'for':'1'});
    var square2 = $('<label>').addClass('square_nps')
    .attr({'for':'2'});
    var square3 = $('<label>').addClass('square_nps')
    .attr({'for':'3'});
    var square4 = $('<label>').addClass('square_nps')
    .attr({'for':'4'});
    var square5 = $('<label>').addClass('square_nps')
    .attr({'for':'5'});
    var square6 = $('<label>').addClass('square_nps')
    .attr({'for':'6'});
    var square7 = $('<label>').addClass('square_nps')
    .attr({'for':'7'});
    var square8 = $('<label>').addClass('square_nps')
    .attr({'for':'8'});
    var square9 = $('<label>').addClass('square_nps')
    .attr({'for':'9'});
    var square10 = $('<label>').addClass('square_nps')
    .attr({'for':'10'});
    var input0 = $('<input>').attr({'type':'radio','name':'fb','value':'0', 'id':'0'});
    var input1 = $('<input>').attr({'type':'radio','name':'fb','value':'1', 'id':'1'});
    var input2 = $('<input>').attr({'type':'radio','name':'fb','value':'2', 'id':'2'});
    var input3 = $('<input>').attr({'type':'radio','name':'fb','value':'3', 'id':'3'});
    var input4 = $('<input>').attr({'type':'radio','name':'fb','value':'4', 'id':'4'});
    var input5 = $('<input>').attr({'type':'radio','name':'fb','value':'5', 'id':'5'});
    var input6 = $('<input>').attr({'type':'radio','name':'fb','value':'6', 'id':'6'});
    var input7 = $('<input>').attr({'type':'radio','name':'fb','value':'7', 'id':'7'});
    var input8 = $('<input>').attr({'type':'radio','name':'fb','value':'8', 'id':'8'});
    var input9 = $('<input>').attr({'type':'radio','name':'fb','value':'9', 'id':'9'});
    var input10 = $('<input>').attr({'type':'radio','name':'fb','value':'10', 'id':'10'});

    var nota0 = '0';
    var nota1 = '1';
    var nota2 = '2';
    var nota3 = '3';
    var nota4 = '4';
    var nota5 = '5';
    var nota6 = '6';
    var nota7 = '7';
    var nota8 = '8';
    var nota9 = '9';
    var nota10 = '10';
    var votovalor = $('<div>').attr({'id':'voto'})
    .css({'display':'none'});


    var motivo_textarea = $('<textarea>')
      .attr({ 'name': 'question' })
      .attr({ 'disabled':'true'})
      .attr({ 'maxlength': '5000' })
      .attr({ 'row': '8' })
      .attr({ 'col': '40' })
      .attr({ 'id': 'lv-tab-textarea-nps' })
      .css({'margin':'15px 0px 15px 10px'});
      var btn_enviar = $('<button>Enviar</button>')
      .attr({ 'id': 'btn_enviar', 'disabled':'true' })
      .addClass('lv-tab-btn-enviar')
      .click(closeNPS);
      var btn_back = $('<button>Voltar ao chat</button>')
      .addClass('lv-tab-btn-enviar-back')
      .attr({ 'id': 'btn_back' })
      .click(backtoChat);
      var div_botoes = $('<div>')
      .attr({'id':'div_botoes'})
      .css({'display':'flex','justify-content': 'center'})
      .append(btn_back)
      .append(btn_enviar)
    square0.append(input0)
    .append(nota0);
    square1.append(input1)
    .append(nota1);
    square2.append(input2)
    .append(nota2);
    square3.append(input3)
    .append(nota3);
    square4.append(input4)
    .append(nota4); 
    square5.append(input5)
    .append(nota5); 
    square6.append(input6)
    .append(nota6); 
    square7.append(input7)
    .append(nota7);
    square8.append(input8)
    .append(nota8);
    square9.append(input9)
    .append(nota9);
    square10.append(input10)
    .append(nota10); 
    vote.append(square0);
    vote.append(square1);
    vote.append(square2);
    vote.append(square3);
    vote.append(square4);
    vote.append(square5);
    vote.append(square6);
    vote.append(square7);
    vote.append(square8);
    vote.append(square9);
    vote.append(square10);
    div_borderfilho.append(parag);
    // div_border.append(icon);
    div_border.append(LiveloBuildChatHeaderNPS());
    div_border.append(div_borderfilho);
    div_border.append(vote);
    div_border.append(votovalor);
    div_border.append(parag_motivo);
    div_border.append(motivo_textarea);
    div_border.append(div_botoes)
    html.append(div_border)
    .addClass('lv-div-nps');
    html.attr({'id':'div_nps'});

    return html;
  }

  var closeNPS = (function () {
    function closeNPS() {
      nmsguser=0;
      var npsson = {};
      var description = $('#lv-tab-textarea-nps').val();
      var notanps = $('#voto').val();
      // console.log(description);
      // console.log(notanps);

     
      npsson.evaluation = notanps;
      npsson.comments = description;

      // console.log(lastMsg);

      hideChat();
      backtoChat();
      createChat = true;
      chatbot_active = false;
      createChatNPS = false;
      $('.lv-messages-list li').remove();
      $('.lv-msg-wrap-client').remove();
      $("[id^='lv-msg-bot']").remove();
      $('.lv-chatbox-date-display-user').remove();
      $('#msg_to_send').val('');

      sendNPSToBroker(sessionCode, npsson);

      //------------------Código Success----------------------------//
      // var balao = $('<div>').addClass('balao')
      //       var frase = $('<p>')
      //       frase.append('Obrigado!')
      //       balao.append(frase);
      //       $('#livelo-everis-chat').append(balao);
      //       setTimeout(function () { //animacçao do botao agradecimento
      //       $('.balao').fadeOut(2000);
      //   // $('.balao').css({
      //   //   "opacity": "0",
      //   //   "transition": "opacity 3s"
      //   // });
      // }, 1000);

      //------------------Código Success----------------------------//


    }
    return closeNPS;
  })();



  var backtoChat = (function () {
    'use strict'
    function backtoChat() {
      nps_layout = true;
      $('#div_nps').remove();
      $('#lv-chatbox-body-messages').css({'opacity':'1'})
      $('#form_bot').css({'opacity':'1'})
      $('#msg_to_send').removeAttr('disabled');
      $('#chat_header').css({'opacity':'1'})
    }
    return backtoChat;
  })();

  var closeNPSwithoutVote = (function () {
    function closeNPSwithoutVote() {
      if (nmsguser>1){
        var exitnps = {
        "evaluation":0,
        "comments":''
        }
        sendNPSToBroker(sessionCode,exitnps);
      }
      // console.log(nmsguser);
      hideChat();
      backtoChat();
      createChat = true;
      createChatNPS = false;
      chatbot_active = false;
      $('.lv-messages-list li').remove();
      $('.lv-msg-wrap-client').remove();
      $("[id^='lv-msg-bot']").remove();
      $('.lv-chatbox-date-display-user').remove();
      $('#msg_to_send').val('');
      npssemvoto = true;
      nmsguser=0;

    }
    return closeNPSwithoutVote;
  })();


  window.onbeforeunload = confirmExit;
  function confirmExit(){
    if (chatbot_active){     
      return 0;
    }
  }

  $(document).on('click', '#resolve-facil-bot', function(){
    resolvefacilbot = true;
    buildHtmlChat();
  });

  $(document).on('click', '#resgate-bra-seguros-bot', function(){
    resgatebraseguros = true;
    buildHtmlChat();
  });

  $(document).on('click', '#fale-conosco', function(){
    buildHtmlChat();
  });

  $(document).on('click', '.vote label', function(){
    // $('#btn_enviar').removeAttr('disabled');
    $('#lv-tab-textarea-nps').removeAttr('disabled');
  });

  $(document).on('keyup', '#lv-tab-textarea-nps', function(){
    if ($('#lv-tab-textarea-nps').val()!=''){
    $('#btn_enviar').removeAttr('disabled');
    } else{
    $('#btn_enviar').attr({'disabled':'disabled'});
    }
    // $('#lv-tab-textarea-nps').removeAttr('disabled');
  });


  $(document).on('click mouseover', '.vote label', function(){
    // remove classe ativa de todas as estrelas
    $('.vote label').removeClass('square_nps-active');
    // pegar o valor do input da estrela clicada
    // var val = $(this).prev('input').val();  
    var val = parseInt($(this)[0].innerText,10);
    // console.log(val);
    //percorrer todas as estrelas
    $('.vote label').each(function(){
        /* checar de o valor clicado é menor ou igual do input atual
        *  se sim, adicionar classe active
        */
        // var $input = $(this).prev('input');
        // if($input.val() <= val){
        //     $(this).addClass('square_nps-active');
        // }
        var $input = $(this)[0].innerText;
        parseInt($input,10);
        if ($input <= val){
          // console.log(val +'/'+ $input)
          $(this).addClass('square_nps-active');
        }
    });
    // $("#voto").val(val); // somente para teste
  });
  //Ao sair da div vote
  $(document).on('mouseleave', '.vote', function(){
    //pegar o valor clicado
    var val = $(this).find('input:checked').val();
    //se nenhum foi clicado remover classe de todos
    if(val == undefined){
        $('.vote label').removeClass('square_nps-active');
    } else { 
        var aux = parseInt(val,10);
        //percorrer todas as estrelas
        $('.vote label').each(function(){
            /* Testar o input atual do laço com o valor clicado
            *  se maior, remover classe, senão adicionar classe
            */
            var $input = $(this)[0].innerText;
            parseInt($input,10);
            if($input > aux){
                $(this).removeClass('square_nps-active');
            } else {
                $(this).addClass('square_nps-active');
            }
        });
    }
    // $("#voto").html(val); // somente para teste
    $("#voto").val(val);
  });
  

  // var LiveloBuildChatHeaderBot = function (){
  //   var html = $('<div>').addClass('lv-tabs-botevaluation');
  //   var teste = $('<p>');
  //   teste.css({'margin-top':'8px','color': '#fff','font-size': '12px'});
  //   teste.append('O que achou da conversa ? Clica <a class="lv-tabs-botevaluation-link id="lv-tabs-botevaluation-link" href="https://livelo.satmetrix.com/app/datacollection/datacollection/dynaSurvey.jsp?p=MTYAAAAAAAAAAJg7ia%2FLwrmHSYGNyUosNfL4%2FjCq%2B0RXYZH%2BIV9bGKu5tqZ3GZPDSV4nSLL1XMjIAm80mpaT%2BA18m4zovHDLSVYtbPHkZbGv7r7LrD6uE7CVYyvHu%2BWGhKOamrT%2BAY%2FVusAxnOWS0%2B%2FqL8jXqkmMIvAHoeS%2FJdAwb9pwjJWnZIm%2BrbCqRr8GHTWEzECJangfE5tUid1gJg4jxS7boqvzdoa6J9yuPAwgbKrWvkpEe7QD54F4UKA%2FaopCPsN2ir4AMg%3D%3D&id=-593427660&peid=LIVELO&collectorType=LINK" target="_blank">aqui</a> e conta pra gente!')
  //   .click({ target: '#lv-tabs-botevaluation-link' }, clickCloseSatisfacao);
  //   $('#lv-tabs-botevaluation-link').css({'color':'#fff'})
  //   html.append(teste);
  //   html.attr({'id':'evaluationbot'});
    

  //   return html;
  // }

  var LiveloBuildChatHeaderTabsTransfHuman = function () {
    var contt_left = $('<p>')
      .append('Agente Digital')
      .click({ target: '#lv-header-tab-left-transf-human' }, clickTabsActive);
    var wrap_left = $('<div>')
      .addClass('lv-tabs-wrap')
      .addClass('col')
      .addClass('s6')
      .attr({ 'id': 'lv-header-tab-left-transf-human' })
      .append(contt_left);
    var contt_right = $('<p>')
      .append('Atendente')
      .click({ target: '#lv-header-tab-right-transf-human' }, clickTabsActive);
    var wrap_right = $('<div>')
      .addClass('lv-tabs-wrap')
      .addClass('col')
      .addClass('s6')
      .addClass('gtm-element-event')
      .attr({ 'id': 'lv-header-tab-right-transf-human',
              'data-gtm-event-category' : 'pontoslivelo:geral',
              'data-gtm-event-action' : 'click:ajuda-flutuante',
              'data-gtm-event-label' : 'guia:atendente'
  })
      .append(contt_right);
    var wrap = $('<div>').addClass('row')
      .append(wrap_left)
      .append(wrap_right);
    var html = $('<div>').addClass('lv-tabs')
    if(originchannel==3 || originchannel==4){
      html.css({
        'z-index':'3',
        'top':'0px'
      })
    }
      html.append(wrap);
    return html;
  }

  var LiveloBuildChatBodyIframeTransfHuman = function (user, email, cpf, protocol, category, channelneo) {
    var sendUser = user ? '&neoname=' + user : '';
    var sendEmail = email ? '&neomail=' + email : '';
    var sendCpf = '&neoCPF=' + cpf;
    var sendProtocol = '&neoprotocol=' + protocol;
    var sendCategory = '&category=' + category;
    if(channelneo!=undefined){
      var sendChannel = '&originchannel=' + channelneo;
      var iframe = $('<iframe>').attr(
        {
          'src': 'https://livelo.neoassist.com/?th=chatcentraliframeNeoa' + sendUser + sendEmail + sendCpf + sendProtocol + sendCategory + sendChannel,
          'width': '360',
          'scrolling': 'true',
          'overflow': 'visible'
        })
        .addClass('lv-chatbox-body-iframe-app');
        if(originchannel==3||originchannel==4){
          iframe.css({
            'top':'33px'
          })
        }
      } else {
      var iframe = $('<iframe>').attr(
        {
          'src': 'https://livelo.neoassist.com/?th=chatcentraliframeNeoa' + sendUser + sendEmail + sendCpf + sendProtocol + sendCategory,
          'width': '360',
          'scrolling': 'true',
          'overflow': 'visible'
        })
        .addClass('lv-chatbox-body-iframe');
        if(originchannel==3||originchannel==4){
          iframe.css({
            'top':'33px'
          })
        }
    }
    return iframe;
  }

  var LiveloBuildChatHeaderTabsSendEmail = function () {
    var contt_left = $('<p>')
      .append('Agente Digital')
      .click({ target: '#lv-header-tab-left-send-email' }, clickTabsActive);
    var wrap_left = $('<div>')
      .addClass('lv-tabs-wrap')
      .addClass('col')
      .addClass('s6')
      .attr({ 'id': 'lv-header-tab-left-send-email' })
      .append(contt_left);
    var contt_right = $('<p>')
      .append('E-mail')
      .click({ target: '#lv-header-tab-right-send-email' }, clickTabsActive);
    var wrap_right = $('<div>')
      .addClass('lv-tabs-wrap')
      .addClass('col')
      .addClass('s6')
      .attr({ 'id': 'lv-header-tab-right-send-email' })
      .append(contt_right);
    var wrap = $('<div>').addClass('row')
      .append(wrap_left)
      .append(wrap_right);
    var html = $('<div>').addClass('lv-tabs')
    if(originchannel==3||originchannel==4){
      html.css({
        'z-index':'3',
        'top':'0px'
      })
    }
      html.append(wrap);
    return html;
  }

  var LiveloBuildChatBodyIframeSendEmail = function (user, email, cpf, topic, msg) {
    var sendUser = user ? '&neoname=' + user : '';
    var sendEmail = email ? '&neomail=' + email : '';
    var sendCpf = '&neoCPF=' + cpf;
    var sendTopic = topic ? '&neotopic=' + topic : '';
    var sendMsg = '&neomsg=' + msg;
    var iframe = $('<iframe>').attr(
      {
        'src': 'https://livelo.neoassist.com/?th=tag_centralliveloemailNeoa' + sendUser + sendEmail + sendCpf + sendTopic + sendMsg,
        'width': '360',
        'scrolling': 'true',
        'overflow': 'visible'
      })
      .addClass('lv-chatbox-body-iframe');
      if(originchannel==3||originchannel==4){
        iframe.css({
          'top':'33px'
        })
      }
    return iframe;
  }

  var LiveloBuildChatBodyLiveloViagensCancel = function (context) {
    var tab_pacote_canc_resgate_textarea = $('<textarea>')
      .attr({ 'name': 'question' })
      .attr({ 'maxlength': '600' })
      .attr({ 'placeholder': 'Digite o motivo para solicitação de cancelamento...' })
      .attr({ 'row': '8' })
      .attr({ 'col': '40' })
      .attr({ 'id': 'lv-tab-textarea' });
    var tab_pacote_canc_resgate_pedido = $('<input>')
      .attr({ 'placeholder': 'Digite o número do pedido','maxlength':'11', 'id': 'tab_numero_pedido'  })
      .addClass('lv-tab-input');
    if (context.CustomerId != undefined && context.CustomerId != "InvalidCustomerId") {
      var tab_pacote_canc_resgate_cpf = $('<input>')
        .addClass('lv-tab-input')
        .val(context.CustomerId)
        .attr({ 'id': 'cpf' })
        .attr({ 'disabled': 'true' });
    }
    else {
      var tab_pacote_canc_resgate_cpf = $('<input>')
        .attr({ 'id':'cpf', 'class':'msk-cpf', 'name':'cpf', 'onblur':'NewActivation.validateCPF(this.value)', 'placeholder': 'Digite o número do seu CPF', 'onkeypress':'NewActivation.cpfOnlyNumberAndEnter(this, event)', 'type':'text' ,'autocomplete':'off', 'maxlength':'14'})
        .addClass('lv-tab-input')
    }
    var tab_swap_btn = $('<button>Enviar</button>')
      .attr({ 'id': 'tab_swap_btn_enviar' })
      .addClass('lv-tab-btn-enviar')
      .click(send_form_pacote_canc_resgate);
    var tab_swap_form = $('<div>')
      .append(tab_pacote_canc_resgate_cpf)
      .append(tab_pacote_canc_resgate_pedido)
      .append(tab_pacote_canc_resgate_textarea)
      .append(tab_swap_btn);
    var html = $('<div>')
      .append(tab_swap_form)
      .addClass('lv-tab')
      .attr({ 'id': 'div1_BodyLiveloViagens1' })
    if(originchannel==3||originchannel==4){
      html.css({
          'top':'33px'
      })
    }
      // .css({'top':'0px'});
    return html;
  }

  var LiveloBuildChatHeaderTabsLiveloViagensCancelamento = function () {
    var contt_left = $('<p>')
      .append('Agente Digital')
      .click({ target: '#lv-header-tab-left-swap' }, clickTabsActive);
    var wrap_left = $('<div>')
      .addClass('lv-tabs-wrap')
      .addClass('col')
      .addClass('s6')
      .attr({ 'id': 'lv-header-tab-left-swap' })
      .append(contt_left);
    var contt_right = $('<p>')
      .append('Cancelamento')
      .click({ target: '#lv-header-tab-right-swap' }, clickTabsActive);
    var wrap_right = $('<div>')
      .addClass('lv-tabs-wrap')
      .addClass('col')
      .addClass('s6')
      .attr({ 'id': 'lv-header-tab-right-swap' })
      .append(contt_right);
    var wrap = $('<div>').addClass('row')
      .append(wrap_left)
      .append(wrap_right);
    var html = $('<div>').addClass('lv-tabs')
    if(originchannel==3||originchannel==4){
      html.css({
        'z-index':'3',
        'top':'0px'
      })
    }
      html.append(wrap);
    return html;
  }


  var LiveloBuildChatHeaderTabsLiveloViagensTroca = function () {
    var contt_left = $('<p>')
      .append('Agente Digital')
      .click({ target: '#lv-header-tab-left-swap' }, clickTabsActive);
    var wrap_left = $('<div>')
      .addClass('lv-tabs-wrap')
      .addClass('col')
      .addClass('s6')
      .attr({ 'id': 'lv-header-tab-left-swap' })
      .append(contt_left);
    var contt_right = $('<p>')
      .append('Troca')
      .click({ target: '#lv-header-tab-right-swap' }, clickTabsActive);
    var wrap_right = $('<div>')
      .addClass('lv-tabs-wrap')
      .addClass('col')
      .addClass('s6')
      .attr({ 'id': 'lv-header-tab-right-swap' })
      .append(contt_right);
    var wrap = $('<div>').addClass('row')
      .append(wrap_left)
      .append(wrap_right);
    var html = $('<div>').addClass('lv-tabs')
    if(originchannel==3||originchannel==4){
      html.css({
        'z-index':'3',
        'top':'0px'
      })
    }
      html.append(wrap);
    return html;
  }

  var LiveloBuildChatBodyLiveloViagensTrocaPacote = function (context) {
    var tab_pacote_troca_resgate_textarea = $('<textarea>')
      .attr({ 'name': 'question' })
      .attr({ 'maxlength': '600' })
      .attr({ 'placeholder': 'Digite o motivo para troca...' })
      .attr({ 'row': '8' })
      .attr({ 'col': '40' })
      .attr({ 'id': 'lv-tab-textarea' });
    var input_nome_passageiro = $('<input>')
      .addClass('lv-tab-input')
      .attr({ 'placeholder': 'Digite o nome do passageiro' })
      .attr({ 'id': 'input_passageiro' });
    var tab_pacote_troca_resgate_pedido = $('<input>')
      .attr({ 'placeholder': 'Digite o número do pedido', 'id': 'tab_numero_pedido','maxlength':'20' })
      .addClass('lv-tab-input');
    if (context.CustomerId != undefined && context.CustomerId != "InvalidCustomerId") {
      var tab_pacote_troca_resgate_cpf = $('<input>')
        .addClass('lv-tab-input')
        .val(context.CustomerId)
        .attr({ 'id': 'cpf' })
        .attr({ 'disabled': 'true' });
    }
    else {
      var tab_pacote_troca_resgate_cpf = $('<input>')
      .attr({ 'id':'cpf', 'class':'msk-cpf', 'name':'cpf', 'onblur':'NewActivation.validateCPF(this.value)', 'placeholder': 'Digite o número do seu CPF', 'onkeypress':'NewActivation.cpfOnlyNumberAndEnter(this, event)', 'type':'text' ,'autocomplete':'off', 'maxlength':'14'})
      .addClass('lv-tab-input')
    }
    var tab_troca_btn = $('<button>Enviar</button>')
      .attr({ 'id': 'tab_swap_btn_enviar' })
      .addClass('lv-tab-btn-enviar')
      .click(send_form_pacote_troca_pacote);
    var check_bilhete_n = $('<input>')
      .attr({ 'type': 'radio' })
      .attr({ 'value': 'Nacional' })
      .attr({ 'name': 'bilhete' })
      .attr({ 'id': 'nacional' });
    var label_bilhete = $('<label>')
      .append('Bilhete:')
      .css({ 'font-weight': 'normal' });
    var label_check_bilhete_n = $('<label>')
      .append('Nacional')
      .css({ 'font-weight': 'normal' })
      .attr({ 'for': 'nacional' });
    var check_bilhete_i = $('<input>')
      .attr({ 'type': 'radio' })
      .attr({ 'id': 'internacional' })
      .attr({ 'value': 'Internacional' })
      .attr({ 'name': 'bilhete' });
    var label_check_bilhete_i = $('<label>')
      .append('Internacional')
      .css({ 'font-weight': 'normal' })
      .attr({ 'for': 'internacional' });
    var div_bilhete = $('<div>')
      .attr({ 'id': 'tipo_bilhete' })
      .addClass('lv-tab-bot-radio')
      .append(label_bilhete)
      .append(check_bilhete_n)
      .append(label_check_bilhete_n)
      .append(check_bilhete_i)
      .append(label_check_bilhete_i);
    var input_cia_aerea = $('<input>')
      .addClass('lv-tab-input')
      .attr({ 'placeholder': 'Digite a cia aérea' })
      .attr({ 'id': 'input_cia_aerea', 'maxlength':'25' });
    var input_data_1 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .css({ 'margin-left': '11px' })
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_ida_voo_1' });
    var input_data_2 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01'})
      .attr({ 'id': 'input_data_volta_voo_1' });
    var input_hora_1 = $('<input>')
      .addClass('lv-tab-prg-date')
      .attr({ 'type': 'time' })
      .attr({ 'id': 'input_hora_ida_voo_1' });
    var input_hora_2 = $('<input>')
      .addClass('lv-tab-prg-date')
      .attr({ 'type': 'time' })
      .attr({ 'id': 'input_hora_volta_voo_1' });
    var input_data_3 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .css({ 'margin-left': '11px' })
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01'})
      .attr({ 'id': 'input_data_ida_voo_2' });
    var input_data_4 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_volta_voo_2' });
    var input_hora_3 = $('<input>')
      .addClass('lv-tab-prg-date')
      .attr({ 'type': 'time' })
      .attr({ 'id': 'input_hora_ida_voo_2' });
    var input_hora_4 = $('<input>')
      .addClass('lv-tab-prg-date')
      .attr({ 'type': 'time' })
      .attr({ 'id': 'input_hora_volta_voo_2' });
    var input_data_5 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .css({ 'margin-left': '11px' })
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_ida_hotel_1' });
    var input_data_6 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_volta_hotel_1' });
    var input_data_7 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .css({ 'margin-left': '11px' })
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_ida_hotel_2' });
    var input_data_8 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_volta_hotel_2' });
    var div_opcao_1_ida = $('<div>')
      .attr({ 'id': 'div_data_1' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Ida:')
      .append(input_data_1)
      .append('Horário:')
      .append(input_hora_1);
    var validacao_data_1_ida = $('<div>')
      .attr({'id':'validacao_data_1_ida'})
      .append(div_opcao_1_ida);
    var div_opcao_1_volta = $('<div>')
      .attr({ 'id': 'div_hora_1' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Volta:')
      .append(input_data_2)
      .append('Horário:')
      .append(input_hora_2);
    var validacao_data_1_volta = $('<div>')
      .attr({'id':'validacao_data_1_volta'})
      .append(div_opcao_1_volta);
    var div_opcao_2_ida = $('<div>')
      .attr({ 'id': 'div_data_2' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Ida:')
      .append(input_data_3)
      .append('Horário:')
      .append(input_hora_3);
    var validacao_data_2_ida = $('<div>')
      .attr({'id':'validacao_data_2_ida'})
      .append(div_opcao_2_ida);
    var div_opcao_2_volta = $('<div>')
      .attr({ 'id': 'div_hora_2' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Volta:')
      .append(input_data_4)
      .append('Horário:')
      .append(input_hora_4);
    var validacao_data_2_volta = $('<div>')
      .attr({'id':'validacao_data_2_volta'})
      .append(div_opcao_2_volta);
    var div_opcao_3_ida = $('<div>')
      .attr({ 'id': 'div_ida_hotel_1' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Ida:')
      .append(input_data_5);
    var validacao_data_3_ida = $('<div>')
      .attr({'id':'validacao_data_3_ida'})
      .append(div_opcao_3_ida);
    var div_opcao_3_volta = $('<div>')
      .attr({ 'id': 'div_volta_hotel_1' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Volta:')
      .append(input_data_6);
    var validacao_data_3_volta = $('<div>')
      .attr({'id':'validacao_data_3_volta'})
      .append(div_opcao_3_volta);
    var div_opcao_4_ida = $('<div>')
      .attr({ 'id': 'div_ida_hotel_2' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Ida:')
      .append(input_data_7);
    var validacao_data_4_ida = $('<div>')
      .attr({'id':'validacao_data_4_ida'})
      .append(div_opcao_4_ida);
    var div_opcao_4_volta = $('<div>')
      .attr({ 'id': 'div_volta_hotel_2' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Volta:')
      .append(input_data_8);
    var validacao_data_4_volta = $('<div>')
      .attr({'id':'validacao_data_4_volta'})
      .append(div_opcao_4_volta);
    var div_data_full_1 = $('<div>')
      .attr({ 'id': 'div_1' })
      .addClass('lv-tab-livelo-viagens-div-data-full')
      .append(validacao_data_1_ida)
      .append(validacao_data_1_volta);
    var label_data_1 = $('<fieldset>')
      .addClass('lv-tab-livelo-viagens-bot-div-legend')
      .append('<legend class = "lv-tab-livelo-viagens-bot-legend" id = "legend-bot-voo-1">1ª opção de dia e horário do voo</legend>')
      .append(div_data_full_1);
    var div_data_full_2 = $('<div>')
      .attr({ 'id': 'div_2' })
      .addClass('lv-tab-livelo-viagens-div-data-full')
      .append(validacao_data_2_ida)
      .append(validacao_data_2_volta);
    var label_data_2 = $('<fieldset>')
      .addClass('lv-tab-livelo-viagens-bot-div-legend')
      .append('<legend class = "lv-tab-livelo-viagens-bot-legend" id = "legend-bot-voo-2">2ª opção</legend>')
      .append(div_data_full_2);
    var div_data_full = $('<div>')
      .append(label_data_1)
      .append(label_data_2);
    var div_data_full_hotel_1 = $('<div>')
      .attr({ 'id': 'div_hotel_1' })
      .addClass('lv-tab-livelo-viagens-div-data-full')
      .append(validacao_data_3_ida)
      .append(validacao_data_3_volta);
    var div_data_full_hotel_2 = $('<div>')
      .attr({ 'id': 'div_hotel_2' })
      .addClass('lv-tab-livelo-viagens-div-data-full')
      .append(validacao_data_4_ida)
      .append(validacao_data_4_volta);
    var label_data_hotel_1 = $('<fieldset>')
      .addClass('lv-tab-livelo-viagens-bot-div-legend')
      .append('<legend class = "lv-tab-livelo-viagens-bot-legend" id = "legend-bot-hotel-1">1ª opção de data para hospedagem</legend>')
      .append(div_data_full_hotel_1);
    var label_data_hotel_2 = $('<fieldset>')
      .addClass('lv-tab-livelo-viagens-bot-div-legend')
      .append('<legend class = "lv-tab-livelo-viagens-bot-legend" id = "legend-bot-hotel-2">2ª opção</legend>')
      .append(div_data_full_hotel_2)
    var div_data_full_hotel = $('<div>')
      .append(label_data_hotel_1)
      .append(label_data_hotel_2)
    var input_hotel = $('<input>')
      .addClass('lv-tab-input')
      .attr({ 'placeholder': 'Digite o nome do hotel desejado', 'maxlength':'20' })
      .attr({ 'id': 'input_hotel' });
    var subtitulo_voo = $('<p>Informações do voo</p>')
      .attr({ 'id': 'subtitulo_voo' })
      .addClass('lv-tab-livelo-viagens-bot-subtitulo');
    var subtitulo_pessoal = $('<p>Informações pessoais</p>')
      .attr({ 'id': 'subtitulo_voo' })
      .addClass('lv-tab-livelo-viagens-bot-subtitulo');
    var subtitulo_hotel = $('<p>Informações de hospedagem</p>')
      .attr({ 'id': 'subtitulo_hotel' })
      .addClass('lv-tab-livelo-viagens-bot-subtitulo')
    var tab_troca_form = $('<div>')
      .append(subtitulo_pessoal)
      .append(tab_pacote_troca_resgate_cpf)
      .append(tab_pacote_troca_resgate_pedido)
      .append(input_nome_passageiro)
      .append(subtitulo_voo)
      .append(div_bilhete)
      .append(input_cia_aerea)
      .append(div_data_full)
      .append(subtitulo_hotel)
      .append(input_hotel)
      .append(div_data_full_hotel)
      .append(tab_pacote_troca_resgate_textarea)
      .append(tab_troca_btn);
    var html = $('<div>')
      .append(tab_troca_form)
      .addClass('lv-tab-livelo-viagens')
      .attr({ 'id': 'div1_BodyLiveloViagens1' });
    return html;
  }

  var LiveloBuildChatBodyLiveloViagensTrocaViagem = function (context) {
    var tab_pacote_troca_resgate_textarea = $('<textarea>')
      .attr({ 'name': 'question' })
      .attr({ 'maxlength': '600' })
      .attr({ 'placeholder': 'Digite o motivo para troca...' })
      .attr({ 'row': '8' })
      .attr({ 'col': '40' })
      .attr({ 'id': 'lv-tab-textarea' });
    var input_nome_passageiro = $('<input>')
      .addClass('lv-tab-input')
      .attr({ 'placeholder': 'Digite o nome do passageiro' })
      .attr({ 'id': 'input_passageiro' });
    var tab_pacote_troca_resgate_pedido = $('<input>')
      .attr({ 'placeholder': 'Digite o número do pedido', 'id': 'tab_numero_pedido','maxlength':'20' })
      .addClass('lv-tab-input');
    if (context.CustomerId != undefined && context.CustomerId != "InvalidCustomerId") {
      var tab_pacote_troca_resgate_cpf = $('<input>')
        .addClass('lv-tab-input')
        .val(context.CustomerId)
        .attr({ 'id': 'cpf' })
        .attr({ 'disabled': 'true' });
    }
    else {
      var tab_pacote_troca_resgate_cpf = $('<input>')
      .attr({ 'id':'cpf', 'class':'msk-cpf', 'name':'cpf', 'onblur':'NewActivation.validateCPF(this.value)', 'placeholder': 'Digite o número do seu CPF', 'onkeypress':'NewActivation.cpfOnlyNumberAndEnter(this, event)', 'type':'text' ,'autocomplete':'off', 'maxlength':'14'})
      .addClass('lv-tab-input')
    }
    var tab_troca_btn = $('<button>Enviar</button>')
      .attr({ 'id': 'tab_swap_btn_enviar' })
      .addClass('lv-tab-btn-enviar')
      .click(send_form_pacote_troca_viagem);
    var check_bilhete_n = $('<input>')
      .attr({ 'type': 'radio' })
      .attr({ 'value': 'Nacional' })
      .attr({ 'name': 'bilhete' })
      .attr({ 'id': 'nacional' });
    var label_bilhete = $('<label>')
      .append('Bilhete:')
      .css({ 'font-weight': 'normal' });
    var label_check_bilhete_n = $('<label>')
      .append('Nacional')
      .css({ 'font-weight': 'normal' })
      .attr({ 'for': 'nacional' });
    var check_bilhete_i = $('<input>')
      .attr({ 'type': 'radio' })
      .attr({ 'id': 'internacional' })
      .attr({ 'value': 'Internacional' })
      .attr({ 'name': 'bilhete' });
    var label_check_bilhete_i = $('<label>')
      .append('Internacional')
      .css({ 'font-weight': 'normal' })
      .attr({ 'for': 'internacional' });
    var div_bilhete = $('<div>')
      .attr({ 'id': 'tipo_bilhete' })
      .addClass('lv-tab-bot-radio')
      .append(label_bilhete)
      .append(check_bilhete_n)
      .append(label_check_bilhete_n)
      .append(check_bilhete_i)
      .append(label_check_bilhete_i);
    var input_cia_aerea = $('<input>')
      .addClass('lv-tab-input')
      .attr({ 'placeholder': 'Digite a cia aérea' })
      .attr({ 'id': 'input_cia_aerea','maxlength':'25' });
    var input_data_1 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .css({ 'margin-left': '11px' })
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_ida_voo_1' });
    var input_data_2 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_volta_voo_1' });
    var input_hora_1 = $('<input>')
      .addClass('lv-tab-prg-date')
      .attr({ 'type': 'time' })
      .attr({ 'id': 'input_hora_ida_voo_1' });
    var input_hora_2 = $('<input>')
      .addClass('lv-tab-prg-date')
      .attr({ 'type': 'time' })
      .attr({ 'id': 'input_hora_volta_voo_1' });
    var input_data_3 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .css({ 'margin-left': '11px' })
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_ida_voo_2' });
    var input_data_4 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01'})
      .attr({ 'id': 'input_data_volta_voo_2' });
    var input_hora_3 = $('<input>')
      .addClass('lv-tab-prg-date')
      .attr({ 'type': 'time' })
      .attr({ 'id': 'input_hora_ida_voo_2' });
    var input_hora_4 = $('<input>')
      .addClass('lv-tab-prg-date')
      .attr({ 'type': 'time' })
      .attr({ 'id': 'input_hora_volta_voo_2' });
    var div_opcao_1_ida = $('<div>')
      .attr({ 'id': 'div_data_1' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Ida:')
      .append(input_data_1)
      .append('Horário:')
      .append(input_hora_1);
    var validacao_data_1_ida = $('<div>')
      .attr({'id':'validacao_data_1_ida'})
      .append(div_opcao_1_ida);
    var div_opcao_1_volta = $('<div>')
      .attr({ 'id': 'div_hora_1' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Volta:')
      .append(input_data_2)
      .append('Horário:')
      .append(input_hora_2);
    var validacao_data_1_volta = $('<div>')
      .attr({'id':'validacao_data_1_volta'})
      .append(div_opcao_1_volta);
    var div_opcao_2_ida = $('<div>')
      .attr({ 'id': 'div_data_2' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Ida:')
      .append(input_data_3)
      .append('Horário:')
      .append(input_hora_3);
    var div_opcao_2_volta = $('<div>')
      .attr({ 'id': 'div_hora_2' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Volta:')
      .append(input_data_4)
      .append('Horário:')
      .append(input_hora_4);
    var div_data_full_1 = $('<div>')
      .attr({ 'id': 'div_1' })
      .addClass('lv-tab-livelo-viagens-div-data-full')
      .append(validacao_data_1_ida)
      .append(validacao_data_1_volta);
    var label_data_1 = $('<fieldset>')
      .addClass('lv-tab-livelo-viagens-bot-div-legend')
      .append('<legend class = "lv-tab-livelo-viagens-bot-legend" id = "legend-bot-voo-1">1ª opção de dia e horário do voo</legend>')
      .append(div_data_full_1);
    var div_data_full_2 = $('<div>')
      .attr({ 'id': 'div_2' })
      .addClass('lv-tab-livelo-viagens-div-data-full')
      .append(div_opcao_2_ida)
      .append(div_opcao_2_volta);
    var label_data_2 = $('<fieldset>')
      .addClass('lv-tab-livelo-viagens-bot-div-legend')
      .append('<legend class = "lv-tab-livelo-viagens-bot-legend" id = "legend-bot-voo-2">2ª opção</legend>')
      .append(div_data_full_2);
    var div_data_full = $('<div>')
      .append(label_data_1)
      .append(label_data_2);
    var subtitulo_voo = $('<p>Informações do voo</p>')
      .attr({ 'id': 'subtitulo_voo' })
      .addClass('lv-tab-livelo-viagens-bot-subtitulo');
    var subtitulo_pessoal = $('<p>Informações pessoais</p>')
      .attr({ 'id': 'subtitulo_voo' })
      .addClass('lv-tab-livelo-viagens-bot-subtitulo');
    var tab_troca_form = $('<div>')
      .append(subtitulo_pessoal)
      .append(tab_pacote_troca_resgate_cpf)
      .append(tab_pacote_troca_resgate_pedido)
      .append(input_nome_passageiro)
      .append(subtitulo_voo)
      .append(div_bilhete)
      .append(input_cia_aerea)
      .append(div_data_full)
      .append(tab_pacote_troca_resgate_textarea)
      .append(tab_troca_btn);
    var html = $('<div>')
      .append(tab_troca_form)
      .addClass('lv-tab-livelo-viagens')
      .attr({ 'id': 'div1_BodyLiveloViagens1' });
    return html;
  }

  var LiveloBuildChatBodyLiveloViagensTrocaHotel = function (context) {
    var tab_pacote_troca_resgate_textarea = $('<textarea>')
      .attr({ 'name': 'question' })
      .attr({ 'maxlength': '600' })
      .attr({ 'placeholder': 'Digite o motivo para troca...' })
      .attr({ 'row': '8' })
      .attr({ 'col': '40' })
      .attr({ 'id': 'lv-tab-textarea' });
    var input_nome_passageiro = $('<input>')
      .addClass('lv-tab-input')
      .attr({ 'placeholder': 'Digite o nome do passageiro' })
      .attr({ 'id': 'input_passageiro' });
    var tab_pacote_troca_resgate_pedido = $('<input>')
      .attr({ 'placeholder': 'Digite o número do pedido', 'id': 'tab_numero_pedido','maxlength':'20' })
      .addClass('lv-tab-input');
    if (context.CustomerId != undefined && context.CustomerId != "InvalidCustomerId") {
      var tab_pacote_troca_resgate_cpf = $('<input>')
        .addClass('lv-tab-input')
        .val(context.CustomerId)
        .attr({ 'id': 'cpf' })
        .attr({ 'disabled': 'true' });
    }
    else {
      var tab_pacote_troca_resgate_cpf = $('<input>')
      .attr({ 'id':'cpf', 'class':'msk-cpf', 'name':'cpf', 'onblur':'NewActivation.validateCPF(this.value)', 'placeholder': 'Digite o número do seu CPF', 'onkeypress':'NewActivation.cpfOnlyNumberAndEnter(this, event)', 'type':'text' ,'autocomplete':'off', 'maxlength':'14'})
      .addClass('lv-tab-input')
    }
    var tab_troca_btn = $('<button>Enviar</button>')
      .attr({ 'id': 'tab_swap_btn_enviar' })
      .addClass('lv-tab-btn-enviar')
      .click(send_form_pacote_troca_hotel);
    var input_data_5 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .css({ 'margin-left': '11px' })
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01'})
      .attr({ 'id': 'input_data_ida_hotel_1' });
    var input_data_6 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_volta_hotel_1' });
    var input_data_7 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .css({ 'margin-left': '11px' })
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_ida_hotel_2' });
    var input_data_8 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_volta_hotel_2' });
    var div_opcao_3_ida = $('<div>')
      .attr({ 'id': 'div_ida_hotel_1' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Ida:')
      .append(input_data_5);
      var validacao_data_1_ida = $('<div>')
      .attr({'id':'validacao_data_1_ida'})
      .append(div_opcao_3_ida);
    var div_opcao_3_volta = $('<div>')
      .attr({ 'id': 'div_volta_hotel_1' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Volta:')
      .append(input_data_6);
      var validacao_data_1_volta = $('<div>')
      .attr({'id':'validacao_data_1_volta'})
      .append(div_opcao_3_volta);
    var div_opcao_4_ida = $('<div>')
      .attr({ 'id': 'div_ida_hotel_2' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Ida:')
      .append(input_data_7);
    var div_opcao_4_volta = $('<div>')
      .attr({ 'id': 'div_volta_hotel_2' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Volta:')
      .append(input_data_8);
    var div_data_full_hotel_1 = $('<div>')
      .attr({ 'id': 'div_hotel_1' })
      .addClass('lv-tab-livelo-viagens-div-data-full')
      .append(validacao_data_1_ida)
      .append(validacao_data_1_volta);
    var div_data_full_hotel_2 = $('<div>')
      .attr({ 'id': 'div_hotel_2' })
      .addClass('lv-tab-livelo-viagens-div-data-full')
      .append(div_opcao_4_ida)
      .append(div_opcao_4_volta);
    var label_data_hotel_1 = $('<fieldset>')
      .addClass('lv-tab-livelo-viagens-bot-div-legend')
      .append('<legend class = "lv-tab-livelo-viagens-bot-legend" id = "legend-bot-hotel-1">1ª opção de data para hospedagem</legend>')
      .append(div_data_full_hotel_1);
    var label_data_hotel_2 = $('<fieldset>')
      .addClass('lv-tab-livelo-viagens-bot-div-legend')
      .append('<legend class = "lv-tab-livelo-viagens-bot-legend" id = "legend-bot-hotel-2">2ª opção</legend>')
      .append(div_data_full_hotel_2)
    var div_data_full_hotel = $('<div>')
      .append(label_data_hotel_1)
      .append(label_data_hotel_2)
    var input_hotel = $('<input>')
      .addClass('lv-tab-input')
      .attr({ 'placeholder': 'Digite o nome do hotel desejado', 'maxlength':'20' })
      .attr({ 'id': 'input_hotel' });
    var subtitulo_pessoal = $('<p>Informações pessoais</p>')
      .attr({ 'id': 'subtitulo_voo' })
      .addClass('lv-tab-livelo-viagens-bot-subtitulo');
    var subtitulo_hotel = $('<p>Informações de hospedagem</p>')
      .attr({ 'id': 'subtitulo_hotel' })
      .addClass('lv-tab-livelo-viagens-bot-subtitulo')
    var tab_troca_form = $('<div>')
      .append(subtitulo_pessoal)
      .append(tab_pacote_troca_resgate_cpf)
      .append(tab_pacote_troca_resgate_pedido)
      .append(input_nome_passageiro)
      .append(subtitulo_hotel)
      .append(input_hotel)
      .append(div_data_full_hotel)
      .append(tab_pacote_troca_resgate_textarea)
      .append(tab_troca_btn);
    var html = $('<div>')
      .append(tab_troca_form)
      .addClass('lv-tab-livelo-viagens')
      .attr({ 'id': 'div1_BodyLiveloViagens1' });
    return html;
  }

  var LiveloBuildChatBodyLiveloViagensTrocaCarro = function (context) {
    var tab_pacote_troca_resgate_textarea = $('<textarea>')
      .attr({ 'name': 'question' })
      .attr({ 'maxlength': '600' })
      .attr({ 'placeholder': 'Digite o motivo para troca...' })
      .attr({ 'row': '8' })
      .attr({ 'col': '40' })
      .attr({ 'id': 'lv-tab-textarea' });
    var input_nome_passageiro = $('<input>')
      .addClass('lv-tab-input')
      .attr({ 'placeholder': 'Digite o nome do passageiro' })
      .attr({ 'id': 'input_passageiro' });
    var tab_pacote_troca_resgate_pedido = $('<input>')
      .attr({ 'placeholder': 'Digite o número do pedido', 'id': 'tab_numero_pedido','maxlength':'20' })
      .addClass('lv-tab-input');
    if (context.CustomerId != undefined && context.CustomerId != "InvalidCustomerId") {
      var tab_pacote_troca_resgate_cpf = $('<input>')
        .addClass('lv-tab-input')
        .val(context.CustomerId)
        .attr({ 'id': 'cpf' })
        .attr({ 'disabled': 'true' });
    }
    else {
      var tab_pacote_troca_resgate_cpf = $('<input>')
      .attr({ 'id':'cpf', 'class':'msk-cpf', 'name':'cpf', 'onblur':'NewActivation.validateCPF(this.value)', 'placeholder': 'Digite o número do seu CPF', 'onkeypress':'NewActivation.cpfOnlyNumberAndEnter(this, event)', 'type':'text' ,'autocomplete':'off', 'maxlength':'14'})
      .addClass('lv-tab-input')
    }
    var tab_troca_btn = $('<button>Enviar</button>')
      .attr({ 'id': 'tab_swap_btn_enviar' })
      .addClass('lv-tab-btn-enviar')
      .click(send_form_pacote_troca_carro);
    var input_data_1 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .css({ 'margin-left': '11px' })
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_ida_voo_1' });
    var input_data_2 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_volta_voo_1' });
    var input_hora_1 = $('<input>')
      .addClass('lv-tab-prg-date')
      .attr({ 'type': 'time' })
      .attr({ 'id': 'input_hora_ida_voo_1' });
    var input_hora_2 = $('<input>')
      .addClass('lv-tab-prg-date')
      .attr({ 'type': 'time' })
      .attr({ 'id': 'input_hora_volta_voo_1' });
    var input_data_3 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .css({ 'margin-left': '11px' })
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_ida_voo_2' });
    var input_data_4 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_volta_voo_2' });
    var input_hora_3 = $('<input>')
      .addClass('lv-tab-prg-date')
      .attr({ 'type': 'time' })
      .attr({ 'id': 'input_hora_ida_voo_2' });
    var input_hora_4 = $('<input>')
      .addClass('lv-tab-prg-date')
      .attr({ 'type': 'time' })
      .attr({ 'id': 'input_hora_volta_voo_2' });
    var input_data_5 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .css({ 'margin-left': '11px' })
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_ida_hotel_1' });
    var input_data_6 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_volta_hotel_1' });
    var input_data_7 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .css({ 'margin-left': '11px' })
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_ida_hotel_2' });
    var input_data_8 = $('<input>')
      .addClass('lv-tab-prg-date')
      .addClass('lv-tab-livelo-viagens-bot-data-ida')
      .attr({ 'type': 'date', 'min': '2019-01-01', 'max':'2025-01-01' })
      .attr({ 'id': 'input_data_volta_hotel_2' });
    var div_opcao_1_ida = $('<div>')
      .attr({ 'id': 'div_data_1' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Ida:')
      .append(input_data_1)
      .append('Horário:')
      .append(input_hora_1);
    var validacao_data_1_ida = $('<div>')
      .attr({'id':'validacao_data_1_ida'})
      .append(div_opcao_1_ida);
    var div_opcao_1_volta = $('<div>')
      .attr({ 'id': 'div_hora_1' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Volta:')
      .append(input_data_2)
      .append('Horário:')
      .append(input_hora_2);
    var validacao_data_1_volta = $('<div>')
      .attr({'id':'validacao_data_1_volta'})
      .append(div_opcao_1_volta);
    var div_opcao_2_ida = $('<div>')
      .attr({ 'id': 'div_data_2' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Ida:')
      .append(input_data_3)
      .append('Horário:')
      .append(input_hora_3);
    var validacao_data_2_ida = $('<div>')
      .attr({'id':'validacao_data_2_ida'})
      .append(div_opcao_2_ida);
    var div_opcao_2_volta = $('<div>')
      .attr({ 'id': 'div_hora_2' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Volta:')
      .append(input_data_4)
      .append('Horário:')
      .append(input_hora_4);
    var validacao_data_2_volta = $('<div>')
      .attr({'id':'validacao_data_2_volta'})
      .append(div_opcao_2_volta);
    var div_opcao_3_ida = $('<div>')
      .attr({ 'id': 'div_ida_hotel_1' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Ida:')
      .append(input_data_5);
    var validacao_data_3_ida = $('<div>')
      .attr({'id':'validacao_data_3_ida'})
      .append(div_opcao_3_ida);
    var div_opcao_3_volta = $('<div>')
      .attr({ 'id': 'div_volta_hotel_1' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Volta:')
      .append(input_data_6);
    var validacao_data_3_volta = $('<div>')
      .attr({'id':'validacao_data_3_volta'})
      .append(div_opcao_3_volta);
    var div_opcao_4_ida = $('<div>')
      .attr({ 'id': 'div_ida_hotel_2' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Ida:')
      .append(input_data_7);
    var validacao_data_4_ida = $('<div>')
      .attr({'id':'validacao_data_4_ida'})
      .append(div_opcao_4_ida);
    var div_opcao_4_volta = $('<div>')
      .attr({ 'id': 'div_volta_hotel_2' })
      .addClass('lv-tab-livelo-viagens-bot-div-data-dias')
      .append('Volta:')
      .append(input_data_8);
    var validacao_data_4_volta = $('<div>')
      .attr({'id':'validacao_data_4_volta'})
      .append(div_opcao_4_volta);
    var div_data_full_1 = $('<div>')
      .attr({ 'id': 'div_1' })
      .addClass('lv-tab-livelo-viagens-div-data-full')
      .append(validacao_data_1_ida)
      .append(validacao_data_1_volta);
    var label_data_1 = $('<fieldset>')
      .addClass('lv-tab-livelo-viagens-bot-div-legend')
      .append('<legend class = "lv-tab-livelo-viagens-bot-legend" id = "legend-bot-voo-1">1ª opção de dia e horário</legend>')
      .append(div_data_full_1);
    var div_data_full_2 = $('<div>')
      .attr({ 'id': 'div_2' })
      .addClass('lv-tab-livelo-viagens-div-data-full')
      .append(validacao_data_2_ida)
      .append(validacao_data_2_volta);
    var label_data_2 = $('<fieldset>')
      .addClass('lv-tab-livelo-viagens-bot-div-legend')
      .append('<legend class = "lv-tab-livelo-viagens-bot-legend" id = "legend-bot-voo-2">2ª opção</legend>')
      .append(div_data_full_2);
    var div_data_full = $('<div>')
      .append(label_data_1)
      .append(label_data_2);
    var div_data_full_hotel_1 = $('<div>')
      .attr({ 'id': 'div_hotel_1' })
      .addClass('lv-tab-livelo-viagens-div-data-full')
      .append(validacao_data_3_ida)
      .append(validacao_data_3_volta);
    var div_data_full_hotel_2 = $('<div>')
      .attr({ 'id': 'div_hotel_2' })
      .addClass('lv-tab-livelo-viagens-div-data-full')
      .append(validacao_data_4_ida)
      .append(validacao_data_4_volta);
    var label_data_hotel_1 = $('<fieldset>')
      .addClass('lv-tab-livelo-viagens-bot-div-legend')
      .append('<legend class = "lv-tab-livelo-viagens-bot-legend" id = "legend-bot-hotel-1">1ª opção de data para hospedagem</legend>')
      .append(div_data_full_hotel_1);
    var label_data_hotel_2 = $('<fieldset>')
      .addClass('lv-tab-livelo-viagens-bot-div-legend')
      .append('<legend class = "lv-tab-livelo-viagens-bot-legend" id = "legend-bot-hotel-2">2ª opção</legend>')
      .append(div_data_full_hotel_2)
    var div_data_full_hotel = $('<div>')
      .append(label_data_hotel_1)
      .append(label_data_hotel_2)
    var input_hotel = $('<input>')
      .addClass('lv-tab-input')
      .attr({ 'placeholder': 'Digite o nome do hotel desejado', 'maxlength':'20' })
      .attr({ 'id': 'input_hotel' });
    var subtitulo_voo = $('<p>Informações do aluguel</p>')
      .attr({ 'id': 'subtitulo_voo' })
      .addClass('lv-tab-livelo-viagens-bot-subtitulo');
    var subtitulo_pessoal = $('<p>Informações pessoais</p>')
      .attr({ 'id': 'subtitulo_voo' })
      .addClass('lv-tab-livelo-viagens-bot-subtitulo');
    var subtitulo_hotel = $('<p>Informações de hospedagem</p>')
      .attr({ 'id': 'subtitulo_hotel' })
      .addClass('lv-tab-livelo-viagens-bot-subtitulo')
    var tab_troca_form = $('<div>')
      .append(subtitulo_pessoal)
      .append(tab_pacote_troca_resgate_cpf)
      .append(tab_pacote_troca_resgate_pedido)
      .append(input_nome_passageiro)
      .append(subtitulo_voo)
      .append(div_data_full)
      .append(subtitulo_hotel)
      .append(input_hotel)
      .append(div_data_full_hotel)
      .append(tab_pacote_troca_resgate_textarea)
      .append(tab_troca_btn);
    var html = $('<div>')
      .append(tab_troca_form)
      .addClass('lv-tab-livelo-viagens')
      .attr({ 'id': 'div1_BodyLiveloViagens1' });
    return html;
  }

  var send_form_pacote_canc_resgate = function (context) {
    var lastMsg = {
      'text': 'FORM_SENT',
      // 'context': { 'broker' : getLastContext() }
      'context': getLastContext()
    };
    // var lastMsgwithtechnicalText = globalDialogue[globalDialogue.length-1];
    var pedido = $('#tab_numero_pedido').val();
    var description = $('#lv-tab-textarea').val();
    var cpf = $('#cpf').val();

    if (pedido == '' || description == '' || cpf == '') {
      $('#tab_numero_pedido').removeClass('lv-tab-bot-naovalido');
      $('#lv-tab-textarea').removeClass('lv-tab-bot-naovalido');
      $('#cpf').removeClass('lv-tab-bot-naovalido');

      if (pedido == '') {
        $('#tab_numero_pedido').addClass('lv-tab-bot-naovalido');
      }

      if (description == '') {
        $('#lv_tab_textarea').addClass('lv-tab-bot-naovalido');
      }
      if (cpf == '') {
        $('#cpf').addClass('lv-tab-bot-naovalido');
      }

      return lastMsg;
    }

    lastMsg.context.front.CustomerIdIn = cpf;
    lastMsg.context.front.Numero_pedido = pedido;
    lastMsg.context.front.Motivo_cancelamento = description;
    lastMsg.context.front.Formulario = "cancelar";

    $('#tab_numero_pedido').removeClass('lv-tab-bot-naovalido');
    $('#lv-tab-textarea').removeClass('lv-tab-bot-naovalido');

    flash = true;
    sendMsgToBroker(getSessionCode(), getLastSessionCode(), lastMsg);

    return context;
  }

  var send_form_pacote_troca_pacote = function () {
    var lastMsg = {
      'text': 'FORM_SENT',
      // 'context': { 'broker' : getLastContext() }
      'context': getLastContext()
    };
    // var lastMsgwithtechnicalText = globalDialogue[globalDialogue.length - 1];
    var pedido = $('#tab_numero_pedido').val();
    var description = $('#lv-tab-textarea').val();
    var cpf = $('#cpf').val();
    var bilheten = $("#nacional").is(":checked");
    var bilhetei = $("#internacional").is(":checked")
    var cia = $('#input_cia_aerea').val();
    var input_data_ida_voo_1 = $('#input_data_ida_voo_1').val();
    var input_data_ida_voo_2 = $('#input_data_ida_voo_2').val();
    var input_data_volta_voo_1 = $('#input_data_volta_voo_1').val();
    var input_data_volta_voo_2 = $('#input_data_volta_voo_2').val();
    var input_hora_ida_voo_1 = $('#input_hora_ida_voo_1').val();
    var input_hora_ida_voo_2 = $('#input_hora_ida_voo_2').val();
    var input_hora_volta_voo_1 = $('#input_hora_volta_voo_1').val();
    var input_hora_volta_voo_2 = $('#input_hora_volta_voo_2').val();
    var input_hotel = $('#input_hotel').val();
    var input_data_ida_hotel_1 = $('#input_data_ida_hotel_1').val();
    var input_data_ida_hotel_2 = $('#input_data_volta_hotel_2').val();
    var input_data_volta_hotel_1 = $('#input_data_volta_hotel_1').val();
    var input_data_volta_hotel_2 = $('#input_data_volta_hotel_2').val();
    var passageiro = $('#input_passageiro').val();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var yyyye = today.getFullYear();
    var mme = today.getMonth() +12;
    if (mme >= 13){
      mme= mme-12;
      yyyye++;
    }

    if (mme < 10) {
      mme = '0' + mme;
    }

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    

    today = yyyy + '-' + mm + '-' + dd;
    var todayeleven = yyyye + '-' + mme + '-' + dd;
    var todayelevenv = yyyye + '-' + mme+1 + '-' + dd;

    if (pedido == '' || description == '' || cpf == '' || cia == '' || input_data_ida_voo_1 == '' || input_data_volta_voo_1 == '' || input_hora_ida_voo_1 == '' || input_hora_volta_voo_1 == '' || input_hotel == '' || input_data_ida_hotel_1 == '' || input_data_volta_hotel_1 == '' || input_data_ida_voo_1 >= todayeleven || input_data_volta_voo_1 >= todayelevenv || input_data_ida_hotel_1 >= todayeleven || input_data_volta_hotel_1 >= todayelevenv ) {
      $('#tab_numero_pedido').removeClass('lv-tab-bot-naovalido');
      $('#lv-tab-textarea').removeClass('lv-tab-bot-naovalido');
      $('#cpf').removeClass('lv-tab-bot-naovalido');
      $('#input_cia_aerea').removeClass('lv-tab-bot-naovalido');
      $('#input_data_ida_voo_1').removeClass('lv-tab-bot-naovalido');
      $('#input_data_volta_voo_1').removeClass('lv-tab-bot-naovalido');
      $('#input_hora_ida_voo_1').removeClass('lv-tab-bot-naovalido');
      $('#input_hora_volta_voo_1').removeClass('lv-tab-bot-naovalido');
      $('#input_hotel').removeClass('lv-tab-bot-naovalido');
      $('#input_data_volta_hotel_1').removeClass('lv-tab-bot-naovalido');
      $('#input_data_ida_hotel_1').removeClass('lv-tab-bot-naovalido');
      if($('#validacaodataida1')){
        $('#validacaodataida1').remove();
      }
      if($('#validacaodatavolta1')){
        $('#validacaodatavolta1').remove();
      }
      if($('#validacaodataida3')){
        $('#validacaodataida3').remove();
      }
      if($('#validacaodatavolta3')){
        $('#validacaodatavolta3').remove();
      }

      if (pedido == '') {
        $('#tab_numero_pedido').addClass('lv-tab-bot-naovalido');
      }
      if (description == '') {
        $('#lv-tab-textarea').addClass('lv-tab-bot-naovalido');
      }
      if (cpf == '') {
        $('#cpf').addClass('lv-tab-bot-naovalido');
      }
      if (cia == '') {
        $('#input_cia_aerea').addClass('lv-tab-bot-naovalido');
      }
      if (input_data_ida_voo_1 == '') {
        $('#input_data_ida_voo_1').addClass('lv-tab-bot-naovalido');
      }
      
      
      if (input_data_ida_voo_1 >= todayeleven) {
        $('#input_data_ida_voo_1').addClass('lv-tab-bot-naovalido');
        var paravalid = $('<p>Data inválida, limite de 11 meses para reserva</p>')
        .css({
          'margin-left': '28px',
          'font-size': '9px',
          'margin-top': '-7px'
        })
        .attr({'id':'validacaodataida1'});
        paravalid.insertAfter($('#div_data_1'))
      }
      if ( input_data_volta_voo_1 >= todayelevenv) {
        $('#input_data_volta_voo_1').addClass('lv-tab-bot-naovalido');
        var paravalid = $('<p>Data inválida, limite de 11 meses para reserva</p>')
        .css({
          'margin-left': '28px',
          'font-size': '9px',
          'margin-top': '-7px'
        })
        .attr({'id':'validacaodatavolta1'});
        paravalid.insertAfter($('#div_hora_1'))
      }

      if (input_data_ida_hotel_1 >= todayeleven) {
        $('#input_data_ida_hotel_1').addClass('lv-tab-bot-naovalido');
        var paravalid = $('<p>Data inválida, limite de 11 meses para reserva</p>')
        .css({
          'margin-left': '28px',
          'font-size': '9px',
          'margin-top': '-7px'
        })
        .attr({'id':'validacaodataida3'});
        paravalid.insertAfter($('#div_ida_hotel_1'))
      }
      if ( input_data_volta_hotel_1 >= todayelevenv) {
        $('#input_data_volta_hotel_1').addClass('lv-tab-bot-naovalido');
        var paravalid = $('<p>Data inválida, limite de 11 meses para reserva</p>')
        .css({
          'margin-left': '28px',
          'font-size': '9px',
          'margin-top': '-7px'
        })
        .attr({'id':'validacaodatavolta3'});
        paravalid.insertAfter($('#div_volta_hotel_1'))
      }


      if (input_data_volta_voo_1 == '') {
        $('#input_data_volta_voo_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_hora_ida_voo_1 == '') {
        $('#input_hora_ida_voo_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_hora_volta_voo_1 == '') {
        $('#input_hora_volta_voo_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_hotel == '') {
        $('#input_hotel').addClass('lv-tab-bot-naovalido');
      }
      if (input_data_volta_hotel_1 == '') {
        $('#input_data_volta_hotel_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_data_ida_hotel_1 == '') {
        $('#input_data_ida_hotel_1').addClass('lv-tab-bot-naovalido');
      }

      return lastMsg;
    }

    lastMsg.context.front.CustomerIdIn = cpf;
    lastMsg.context.front.Numero_pedido = pedido;
    lastMsg.context.front.Motivo_cancelamento = description;
    lastMsg.context.front.Cia_aerea = cia;
    lastMsg.context.front.Data_viagem_ida_1 = input_data_ida_voo_1;
    lastMsg.context.front.Data_viagem_volta_1 = input_data_volta_voo_1;
    lastMsg.context.front.Horario_viagem_ida_1 = input_hora_ida_voo_1;
    lastMsg.context.front.Horario_viagem_volta_1 = input_hora_volta_voo_1;
    lastMsg.context.front.Data_viagem_ida_2 = input_data_ida_voo_2;
    lastMsg.context.front.Data_viagem_volta_2 = input_data_volta_voo_2;
    lastMsg.context.front.Horario_viagem_ida_2 = input_hora_ida_voo_2;
    lastMsg.context.front.Horario_viagem_volta_2 = input_hora_volta_voo_2;
    lastMsg.context.front.Hotel_hospedagem = input_hotel;
    lastMsg.context.front.Data_hospedagem_ida_1 = input_data_ida_hotel_1;
    lastMsg.context.front.Data_hospedagem_volta_1 = input_data_volta_hotel_1;
    lastMsg.context.front.Data_hospedagem_ida_2 = input_data_ida_hotel_2;
    lastMsg.context.front.Data_hospedagem_volta_2 = input_data_volta_hotel_2;
    lastMsg.context.front.Passageiro = passageiro;
    lastMsg.context.front.Formulario = "trocapacote";
    if (bilheten == true && bilhetei == false) {
      lastMsg.context.front.Bilhete = "Nacional";
    }
    if (bilheten == false && bilhetei == true) {
      lastMsg.context.front.Bilhete = "Internacional";
    }

    $('#tab_numero_pedido').removeClass('lv-tab-bot-naovalido');
    $('#lv-tab-textarea').removeClass('lv-tab-bot-naovalido');
    $('#input_cia_aerea').removeClass('lv-tab-bot-naovalido');
    $('#input_data_ida_voo_1').removeClass('lv-tab-bot-naovalido');
    $('#input_data_volta_voo_1').removeClass('lv-tab-bot-naovalido');
    $('#input_hora_ida_voo_1').removeClass('lv-tab-bot-naovalido');
    $('#input_hora_volta_voo_1').removeClass('lv-tab-bot-naovalido');
    $('#input_hotel').removeClass('lv-tab-bot-naovalido');
    $('#input_data_volta_hotel_1').removeClass('lv-tab-bot-naovalido');
    $('#input_data_ida_hotel_1').removeClass('lv-tab-bot-naovalido');

    flash = true;
    sendMsgToBroker(getSessionCode(), getLastSessionCode(), lastMsg);

    // console.log(lastMsg);
    return lastMsg;
  }

  var send_form_pacote_troca_viagem = function () {

    var lastMsg = {
      'text': 'FORM_SENT',
      // 'context': { 'broker' : getLastContext() }
      'context': getLastContext()
    };

    // var lastMsgwithtechnicalText = globalDialogue[globalDialogue.length - 1];
    var pedido = $('#tab_numero_pedido').val();
    var description = $('#lv-tab-textarea').val();
    var cpf = $('#cpf').val();
    var bilheten = $("#nacional").is(":checked");
    var bilhetei = $("#internacional").is(":checked")
    var cia = $('#input_cia_aerea').val();
    var input_data_ida_voo_1 = $('#input_data_ida_voo_1').val();
    var input_data_ida_voo_2 = $('#input_data_ida_voo_2').val();
    var input_data_volta_voo_1 = $('#input_data_volta_voo_1').val();
    var input_data_volta_voo_2 = $('#input_data_volta_voo_2').val();
    var input_hora_ida_voo_1 = $('#input_hora_ida_voo_1').val();
    var input_hora_ida_voo_2 = $('#input_hora_ida_voo_2').val();
    var input_hora_volta_voo_1 = $('#input_hora_volta_voo_1').val();
    var input_hora_volta_voo_2 = $('#input_hora_volta_voo_2').val();
    var passageiro = $('#input_passageiro').val();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var yyyye = today.getFullYear();
    var mme = today.getMonth() +12;
    if (mme >= 13){
      mme= mme-12;
      yyyye++;
    }

    if (mme < 10) {
      mme = '0' + mme;
    }

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    

    today = yyyy + '-' + mm + '-' + dd;
    var todayeleven = yyyye + '-' + mme + '-' + dd;
    var todayelevenv = yyyye + '-' + mme+1 + '-' + dd;


    if (pedido == '' || description == '' || cpf == '' || cia == '' || input_data_ida_voo_1 == '' || input_data_volta_voo_1 == '' || input_hora_ida_voo_1 == '' || input_hora_volta_voo_1 == '' || input_data_ida_voo_1 >= todayeleven || input_data_volta_voo_1 >= todayelevenv) {
      $('#tab_numero_pedido').removeClass('lv-tab-bot-naovalido');
      $('#lv-tab-textarea').removeClass('lv-tab-bot-naovalido');
      $('#cpf').removeClass('lv-tab-bot-naovalido');
      $('#input_cia_aerea').removeClass('lv-tab-bot-naovalido');
      $('#input_data_ida_voo_1').removeClass('lv-tab-bot-naovalido');
      $('#input_data_volta_voo_1').removeClass('lv-tab-bot-naovalido');
      $('#input_hora_ida_voo_1').removeClass('lv-tab-bot-naovalido');
      $('#input_hora_volta_voo_1').removeClass('lv-tab-bot-naovalido');

      if (pedido == '') {
        $('#tab_numero_pedido').addClass('lv-tab-bot-naovalido');
      }
      if (description == '') {
        $('#lv-tab-textarea').addClass('lv-tab-bot-naovalido');
      }
      if (cpf == '') {
        $('#cpf').addClass('lv-tab-bot-naovalido');
      }
      if (cia == '') {
        $('#input_cia_aerea').addClass('lv-tab-bot-naovalido');
      }
      if (input_data_ida_voo_1 == '') {
        $('#input_data_ida_voo_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_data_volta_voo_1 == '') {
        $('#input_data_volta_voo_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_hora_ida_voo_1 == '') {
        $('#input_hora_ida_voo_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_hora_volta_voo_1 == '') {
        $('#input_hora_volta_voo_1').addClass('lv-tab-bot-naovalido');
      }
      if($('#validacaodataida1')){
        $('#validacaodataida1').remove();
      }
      if($('#validacaodatavolta1')){
        $('#validacaodatavolta1').remove();
      }

      if (input_data_ida_voo_1 >= todayeleven) {
        $('#input_data_ida_voo_1').addClass('lv-tab-bot-naovalido');
        var paravalid = $('<p>Data inválida, limite de 11 meses para reserva</p>')
        .css({
          'margin-left': '28px',
          'font-size': '9px',
          'margin-top': '-7px'
        })
        .attr({'id':'validacaodataida1'});
        paravalid.insertAfter($('#div_data_1'))
      }
      if ( input_data_volta_voo_1 >= todayelevenv) {
        $('#input_data_volta_voo_1').addClass('lv-tab-bot-naovalido');
        var paravalid = $('<p>Data inválida, limite de 11 meses para reserva</p>')
        .css({
          'margin-left': '28px',
          'font-size': '9px',
          'margin-top': '-7px'
        })
        .attr({'id':'validacaodatavolta1'});
        paravalid.insertAfter($('#div_hora_1'))
      }


      return lastMsg;
    }

    lastMsg.context.front.CustomerIdIn = cpf;
    lastMsg.context.front.Numero_pedido = pedido;
    lastMsg.context.front.Motivo_cancelamento = description;
    lastMsg.context.front.Cia_aerea = cia;
    lastMsg.context.front.Data_viagem_ida_1 = input_data_ida_voo_1;
    lastMsg.context.front.Data_viagem_volta_1 = input_data_volta_voo_1;
    lastMsg.context.front.Horario_viagem_ida_1 = input_hora_ida_voo_1;
    lastMsg.context.front.Horario_viagem_volta_1 = input_hora_volta_voo_1;
    lastMsg.context.front.Data_viagem_ida_2 = input_data_ida_voo_2;
    lastMsg.context.front.Data_viagem_volta_2 = input_data_volta_voo_2;
    lastMsg.context.front.Horario_viagem_ida_2 = input_hora_ida_voo_2;
    lastMsg.context.front.Horario_viagem_volta_2 = input_hora_volta_voo_2;
    lastMsg.context.front.Passageiro = passageiro;
    lastMsg.context.front.Formulario = "trocapassagem";
    if (bilheten == true && bilhetei == false) {
      lastMsg.context.front.Bilhete = "Nacional";
    }
    if (bilheten == false && bilhetei == true) {
      lastMsg.context.front.Bilhete = "Internacional";
    }

    $('#tab_numero_pedido').removeClass('lv-tab-bot-naovalido');
    $('#lv-tab-textarea').removeClass('lv-tab-bot-naovalido');
    $('#input_cia_aerea').removeClass('lv-tab-bot-naovalido');
    $('#input_data_ida_voo_1').removeClass('lv-tab-bot-naovalido');
    $('#input_data_volta_voo_1').removeClass('lv-tab-bot-naovalido');
    $('#input_hora_ida_voo_1').removeClass('lv-tab-bot-naovalido');
    $('#input_hora_volta_voo_1').removeClass('lv-tab-bot-naovalido');


    flash = true;
    sendMsgToBroker(getSessionCode(), getLastSessionCode(), lastMsg);


    return lastMsg;
  }

  var send_form_pacote_troca_hotel = function () {
    var lastMsg = {
      'text': 'FORM_SENT',
      // 'context': { 'broker' : getLastContext() }
      'context': getLastContext()
    };
    // var lastMsgwithtechnicalText = globalDialogue[globalDialogue.length - 1];
    var pedido = $('#tab_numero_pedido').val();
    var description = $('#lv-tab-textarea').val();
    var cpf = $('#cpf').val();
    var input_hotel = $('#input_hotel').val();
    var input_data_ida_hotel_1 = $('#input_data_ida_hotel_1').val();
    var input_data_ida_hotel_2 = $('#input_data_volta_hotel_2').val();
    var input_data_volta_hotel_1 = $('#input_data_volta_hotel_1').val();
    var input_data_volta_hotel_2 = $('#input_data_volta_hotel_2').val();
    var passageiro = $('#input_passageiro').val();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var yyyye = today.getFullYear();
    var mme = today.getMonth() +12;
    if (mme >= 13){
      mme= mme-12;
      yyyye++;
    }

    if (mme < 10) {
      mme = '0' + mme;
    }

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    

    today = yyyy + '-' + mm + '-' + dd;
    var todayeleven = yyyye + '-' + mme + '-' + dd;
    var todayelevenv = yyyye + '-' + mme+1 + '-' + dd;


    if (pedido == '' || description == '' || cpf == '' || input_hotel == '' || input_data_ida_hotel_1 == '' || input_data_volta_hotel_1 == '' || input_data_ida_hotel_1 >= todayeleven || input_data_volta_hotel_1 >= todayelevenv) {
      $('#tab_numero_pedido').removeClass('lv-tab-bot-naovalido');
      $('#lv-tab-textarea').removeClass('lv-tab-bot-naovalido');
      $('#cpf').removeClass('lv-tab-bot-naovalido');
      $('#input_hotel').removeClass('lv-tab-bot-naovalido');
      $('#input_data_volta_hotel_1').removeClass('lv-tab-bot-naovalido');
      $('#input_data_ida_hotel_1').removeClass('lv-tab-bot-naovalido');

      if (pedido == '') {
        $('#tab_numero_pedido').addClass('lv-tab-bot-naovalido');
      }
      if (description == '') {
        $('#lv-tab-textarea').addClass('lv-tab-bot-naovalido');
      }
      if (cpf == '') {
        $('#cpf').addClass('lv-tab-bot-naovalido');
      }
      if (input_hotel == '') {
        $('#input_hotel').addClass('lv-tab-bot-naovalido');
      }
      if (input_data_volta_hotel_1 == '') {
        $('#input_data_volta_hotel_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_data_ida_hotel_1 == '') {
        $('#input_data_ida_hotel_1').addClass('lv-tab-bot-naovalido');
      }
      if($('#validacaodataida1')){
        $('#validacaodataida1').remove();
      }
      if($('#validacaodatavolta1')){
        $('#validacaodatavolta1').remove();
      }
      if (input_data_ida_hotel_1 >= todayeleven) {
        $('#input_data_ida_voo_1').addClass('lv-tab-bot-naovalido');
        var paravalid = $('<p>Data inválida, limite de 11 meses para reserva</p>')
        .css({
          'margin-left': '28px',
          'font-size': '9px',
          'margin-top': '-7px'
        })
        .attr({'id':'validacaodataida1'});
        paravalid.insertAfter($('#div_ida_hotel_1'))
      }
      if ( input_data_volta_hotel_1 >= todayelevenv) {
        $('#input_data_volta_voo_1').addClass('lv-tab-bot-naovalido');
        var paravalid = $('<p>Data inválida, limite de 11 meses para reserva</p>')
        .css({
          'margin-left': '28px',
          'font-size': '9px',
          'margin-top': '-7px'
        })
        .attr({'id':'validacaodatavolta1'});
        paravalid.insertAfter($('#div_volta_hotel_1'))
      }

      return lastMsg;
    }

    lastMsg.context.front.CustomerIdIn = cpf;
    lastMsg.context.front.Numero_pedido = pedido;
    lastMsg.context.front.Motivo_cancelamento = description;
    lastMsg.context.front.Hotel_hospedagem = input_hotel;
    lastMsg.context.front.Data_hospedagem_ida_1 = input_data_ida_hotel_1;
    lastMsg.context.front.Data_hospedagem_volta_1 = input_data_volta_hotel_1;
    lastMsg.context.front.Data_hospedagem_ida_2 = input_data_ida_hotel_2;
    lastMsg.context.front.Data_hospedagem_volta_2 = input_data_volta_hotel_2;
    lastMsg.context.front.Passageiro = passageiro;
    lastMsg.context.front.Formulario = "trocahotel";


    $('#tab_numero_pedido').removeClass('lv-tab-bot-naovalido');
    $('#lv-tab-textarea').removeClass('lv-tab-bot-naovalido');
    $('#input_hotel').removeClass('lv-tab-bot-naovalido');
    $('#input_data_volta_hotel_1').removeClass('lv-tab-bot-naovalido');
    $('#input_data_ida_hotel_1').removeClass('lv-tab-bot-naovalido');

    flash = true;
    sendMsgToBroker(getSessionCode(), getLastSessionCode(), lastMsg);

    // console.log(lastMsg);
    return lastMsg;
  }

  var send_form_pacote_troca_carro = function () {
    var lastMsg = {
      'text': 'FORM_SENT',
      // 'context': { 'broker' : getLastContext() }
      'context': getLastContext()
    };
    // var lastMsg = globalDialogue[globalDialogue.length - 1];
    var pedido = $('#tab_numero_pedido').val();
    var description = $('#lv-tab-textarea').val();
    var cpf = $('#cpf').val();
    var input_data_ida_voo_1 = $('#input_data_ida_voo_1').val();
    var input_data_ida_voo_2 = $('#input_data_ida_voo_2').val();
    var input_data_volta_voo_1 = $('#input_data_volta_voo_1').val();
    var input_data_volta_voo_2 = $('#input_data_volta_voo_2').val();
    var input_hora_ida_voo_1 = $('#input_hora_ida_voo_1').val();
    var input_hora_ida_voo_2 = $('#input_hora_ida_voo_2').val();
    var input_hora_volta_voo_1 = $('#input_hora_volta_voo_1').val();
    var input_hora_volta_voo_2 = $('#input_hora_volta_voo_2').val();
    var input_hotel = $('#input_hotel').val();
    var input_data_ida_hotel_1 = $('#input_data_ida_hotel_1').val();
    var input_data_ida_hotel_2 = $('#input_data_volta_hotel_2').val();
    var input_data_volta_hotel_1 = $('#input_data_volta_hotel_1').val();
    var input_data_volta_hotel_2 = $('#input_data_volta_hotel_2').val();
    var passageiro = $('#input_passageiro').val();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var yyyye = today.getFullYear();
    var mme = today.getMonth() +12;
    if (mme >= 13){
      mme= mme-12;
      yyyye++;
    }

    if (mme < 10) {
      mme = '0' + mme;
    }

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    

    today = yyyy + '-' + mm + '-' + dd;
    var todayeleven = yyyye + '-' + mme + '-' + dd;
    var todayelevenv = yyyye + '-' + mme+1 + '-' + dd;


    if (pedido == '' || description == '' || cpf == '' || input_data_ida_voo_1 == '' || input_data_volta_voo_1 == '' || input_hora_ida_voo_1 == '' || input_hora_volta_voo_1 == '' || input_hotel == '' || input_data_ida_hotel_1 == '' || input_data_volta_hotel_1 == '', input_data_ida_voo_1 >= todayeleven || input_data_volta_voo_1 >= todayelevenv || input_data_ida_hotel_1 >= todayeleven || input_data_volta_hotel_1 >= todayelevenv ) {
      $('#tab_numero_pedido').removeClass('lv-tab-bot-naovalido');
      $('#lv-tab-textarea').removeClass('lv-tab-bot-naovalido');
      $('#cpf').removeClass('lv-tab-bot-naovalido');
      $('#input_data_ida_voo_1').removeClass('lv-tab-bot-naovalido');
      $('#input_data_volta_voo_1').removeClass('lv-tab-bot-naovalido');
      $('#input_hora_ida_voo_1').removeClass('lv-tab-bot-naovalido');
      $('#input_hora_volta_voo_1').removeClass('lv-tab-bot-naovalido');
      $('#input_hotel').removeClass('lv-tab-bot-naovalido');
      $('#input_data_volta_hotel_1').removeClass('lv-tab-bot-naovalido');
      $('#input_data_ida_hotel_1').removeClass('lv-tab-bot-naovalido');

      if($('#validacaodataida1')){
        $('#validacaodataida1').remove();
      }
      if($('#validacaodatavolta1')){
        $('#validacaodatavolta1').remove();
      }
      if($('#validacaodataida3')){
        $('#validacaodataida3').remove();
      }
      if($('#validacaodatavolta3')){
        $('#validacaodatavolta3').remove();
      }

      if (pedido == '') {
        $('#tab_numero_pedido').addClass('lv-tab-bot-naovalido');
      }
      if (description == '') {
        $('#lv-tab-textarea').addClass('lv-tab-bot-naovalido');
      }
      if (cpf == '') {
        $('#cpf').addClass('lv-tab-bot-naovalido');
      }
      if (input_data_ida_voo_1 == '') {
        $('#input_data_ida_voo_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_data_volta_voo_1 == '') {
        $('#input_data_volta_voo_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_hora_ida_voo_1 == '') {
        $('#input_hora_ida_voo_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_hora_volta_voo_1 == '') {
        $('#input_hora_volta_voo_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_hotel == '') {
        $('#input_hotel').addClass('lv-tab-bot-naovalido');
      }
      if (input_data_volta_hotel_1 == '') {
        $('#input_data_volta_hotel_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_data_ida_hotel_1 == '') {
        $('#input_data_ida_hotel_1').addClass('lv-tab-bot-naovalido');
      }
      if (input_data_ida_voo_1 >= todayeleven) {
        $('#input_data_ida_voo_1').addClass('lv-tab-bot-naovalido');
        var paravalid = $('<p>Data inválida, limite de 11 meses para reserva</p>')
        .css({
          'margin-left': '28px',
          'font-size': '9px',
          'margin-top': '-7px'
        })
        .attr({'id':'validacaodataida1'});
        paravalid.insertAfter($('#div_data_1'))
      }
      if ( input_data_volta_voo_1 >= todayelevenv) {
        $('#input_data_volta_voo_1').addClass('lv-tab-bot-naovalido');
        var paravalid = $('<p>Data inválida, limite de 11 meses para reserva</p>')
        .css({
          'margin-left': '28px',
          'font-size': '9px',
          'margin-top': '-7px'
        })
        .attr({'id':'validacaodatavolta1'});
        paravalid.insertAfter($('#div_hora_1'))
      }

      if (input_data_ida_hotel_1 >= todayeleven) {
        $('#input_data_ida_hotel_1').addClass('lv-tab-bot-naovalido');
        var paravalid = $('<p>Data inválida, limite de 11 meses para reserva</p>')
        .css({
          'margin-left': '28px',
          'font-size': '9px',
          'margin-top': '-7px'
        })
        .attr({'id':'validacaodataida3'});
        paravalid.insertAfter($('#div_ida_hotel_1'))
      }
      if ( input_data_volta_hotel_1 >= todayelevenv) {
        $('#input_data_volta_hotel_1').addClass('lv-tab-bot-naovalido');
        var paravalid = $('<p>Data inválida, limite de 11 meses para reserva</p>')
        .css({
          'margin-left': '28px',
          'font-size': '9px',
          'margin-top': '-7px'
        })
        .attr({'id':'validacaodatavolta3'});
        paravalid.insertAfter($('#div_volta_hotel_1'))
      }

      return lastMsg;
    }


    lastMsg.context.front.CustomerIdIn = cpf;
    lastMsg.context.front.Numero_pedido = pedido;
    lastMsg.context.front.Motivo_cancelamento = description;
    lastMsg.context.front.Data_viagem_ida_1 = input_data_ida_voo_1;
    lastMsg.context.front.Data_viagem_volta_1 = input_data_volta_voo_1;
    lastMsg.context.front.Horario_viagem_ida_1 = input_hora_ida_voo_1;
    lastMsg.context.front.Horario_viagem_volta_1 = input_hora_volta_voo_1;
    lastMsg.context.front.Data_viagem_ida_2 = input_data_ida_voo_2;
    lastMsg.context.front.Data_viagem_volta_2 = input_data_volta_voo_2;
    lastMsg.context.front.Horario_viagem_ida_2 = input_hora_ida_voo_2;
    lastMsg.context.front.Horario_viagem_volta_2 = input_hora_volta_voo_2;
    lastMsg.context.front.Hotel_hospedagem = input_hotel;
    lastMsg.context.front.Data_hospedagem_ida_1 = input_data_ida_hotel_1;
    lastMsg.context.front.Data_hospedagem_volta_1 = input_data_volta_hotel_1;
    lastMsg.context.front.Data_hospedagem_ida_2 = input_data_ida_hotel_2;
    lastMsg.context.front.Data_hospedagem_volta_2 = input_data_volta_hotel_2;
    lastMsg.context.front.Passageiro = passageiro;
    lastMsg.context.front.Formulario = "trocacarro";


    $('#tab_numero_pedido').removeClass('lv-tab-bot-naovalido');
    $('#lv-tab-textarea').removeClass('lv-tab-bot-naovalido');
    $('#input_data_ida_voo_1').removeClass('lv-tab-bot-naovalido');
    $('#input_data_volta_voo_1').removeClass('lv-tab-bot-naovalido');
    $('#input_hora_ida_voo_1').removeClass('lv-tab-bot-naovalido');
    $('#input_hora_volta_voo_1').removeClass('lv-tab-bot-naovalido');
    $('#input_hotel').removeClass('lv-tab-bot-naovalido');
    $('#input_data_volta_hotel_1').removeClass('lv-tab-bot-naovalido');
    $('#input_data_ida_hotel_1').removeClass('lv-tab-bot-naovalido');

    flash = true;
    sendMsgToBroker(getSessionCode(), getLastSessionCode(), lastMsg);

    // console.log(lastMsg);
    return lastMsg;
  }


  var SolicitacaoSucesso = function (lastMsg) {

    $('tab_swap_btn_enviar')
      .css({ 'background': '7d7d7d' });
    $('#div1_BodyLiveloViagens1').remove();
    $('#tela_loading').remove();
    var img_check = $('<img>')
      .attr({ 'src': origin_url + '/assets/icons/Checked.PNG' })
      .addClass('lv-tab-success-img')
      .attr({ 'id': 'img_check' });
    var msg_check = $('<p>')
      .css({'font-size':'15px'})
      .append('<center>Sua solicitação foi enviada com sucesso!!!</center><br><center>Seu protocolo é ' + lastMsg.context.front.protocolId + '</center>');
    var btn_back = $('<button>Voltar ao chat</button>')
      .addClass('lv-tab-btn-enviar-back')
      .attr({ 'id': 'tab_swap_btn_back' })
      .click({ target: '#lv-header-tab-left-swap' }, clickTabsActive);
    var html = $('<div>')
      .attr({ 'id': 'ajaxsucesso' })
      .append(img_check)
      .append(msg_check)
      .append(btn_back)
      .addClass('lv-tab');

      form_next_action = false;
      document.getElementById("btn_toForm").setAttribute("id", "btn_toForm_old"); 

    return html;


  }


  var SolicitacaoErro = function () {

    $('tab_swap_btn_enviar')
      .css({ 'background': '7d7d7d' });
    $('#tela_loading').remove();
    $('#div1_BodyLiveloViagens1').remove();
    var img_check = $('<img>')
      .attr({ 'src': origin_url + '/assets/icons/NotChecked.jpg' })
      .addClass('lv-tab-success-img')
      .attr({ 'id': 'img_check' });
    var msg_check = $('<p>')
      .css({'font-size':'15px'})
      .append('<center>Sua solicitação não foi concluída, favor tentar novamente mais tarde.</center>')
    var btn_back = $('<button>Voltar ao chat</button>')
      .addClass('lv-tab-btn-enviar-back')
      .attr({ 'id': 'tab_swap_btn_back' })
      .click({ target: '#lv-header-tab-left-swap' }, clickTabsActive);
    var btn_try_again = $('<button>Tentar novamente</button>')
      .addClass('lv-tab-btn-enviar-back')
      .attr({ 'id': 'tab_swap_btn_try_again' })
      .click(btntryagain());
    var div_botoes = $('<div>')
      .attr({'id':'div_botoes'})
      .css({'display':'flex'})
      .append(btn_back)
      .append(btn_try_again)
    var html = $('<div>')
      .attr({ 'id': 'ajaxerro' })
      .append(img_check)
      .append(msg_check)
      .append(div_botoes)
      .addClass('lv-tab');

    return html;


  }

  // var SolicitacaoErroOut = function (lastMsg) {

  //   $('tab_swap_btn_enviar')
  //     .css({ 'background': '7d7d7d' });
  //   $('#tela_loading').remove();
  //   $('#div1_BodyLiveloViagens1').remove();
  //   var img_check = $('<img>')
  //     .attr({ 'src': origin_url + '/assets/icons/NotChecked.jpg' })
  //     .addClass('lv-tab-success-img')
  //     .attr({ 'id': 'img_check' });
  //   var msg_check = $('<p>')
  //     .css({'font-size':'15px'})
  //     .append('<center>' + lastMsg.context.broker.erro_msg + '</center>')
  //   var btn_back = $('<button>Voltar ao chat</button>')
  //     .addClass('lv-tab-btn-enviar-back')
  //     .attr({ 'id': 'tab_swap_btn_back' })
  //     .click({ target: '#lv-header-tab-left-swap' }, clickTabsActive);
  //   var btn_try_again = $('<button>Tentar novamente</button>')
  //     .addClass('lv-tab-btn-enviar-back')
  //     .attr({ 'id': 'tab_swap_btn_try_again' })
  //     .click(btntryagain());
  //   var div_botoes = $('<div>')
  //     .attr({'id':'div_botoes'})
  //     .css({'display':'flex'})
  //     .append(btn_back)
  //     .append(btn_try_again)
  //   var html = $('<div>')
  //     .attr({ 'id': 'ajaxerroout' })
  //     .append(img_check)
  //     .append(msg_check)
  //     .append(div_botoes)
  //     .addClass('lv-tab');

  //   return html;


  // }

  var SolicitacaoLoading = function () {

    $('tab_swap_btn_enviar')
      .css({ 'background': '7d7d7d' });
    $('#div1_BodyLiveloViagens1').remove();
    var img_check = $('<img>')
      .attr({ 'src': origin_url + '/assets/icons/loadingsendform.gif' })
      .addClass('lv-tab-success-img')
      .attr({ 'id': 'img_check' });
    var html = $('<div>')
      .attr({ 'id': 'tela_loading' })
      .append(img_check)
      .addClass('lv-tab');

    return html;


  }




  // var LiveloBuildChatDateDisplay = function () {
  //   var date = new Date();
  //   const weekDays = [
  //     'Domingo',
  //     'Segunda-feira',
  //     'Terça-feira',
  //     'Quarta-feira',
  //     'Quinta-feira',
  //     'Sexta-feira',
  //     'Sábado'
  //   ];
  //   const months = [
  //     'janeiro',
  //     'fevereiro',
  //     'março',
  //     'abril',
  //     'maio',
  //     'junho',
  //     'julho',
  //     'agosto',
  //     'setembro',
  //     'outubro',
  //     'novembro',
  //     'dezembro'
  //   ];

  //   var currentWeekDay = weekDays[date.getDay()];
  //   var currentDay = date.getDate();
  //   var currentMonth = months[date.getMonth()];
  //   var currentYear = date.getFullYear();

  //   var dateDisplay = $('<h6 id="lv-chatbox-date-display">'
  //     + currentWeekDay + ', ' + currentDay + ' de '
  //     + currentMonth + ' de ' + currentYear + '</h6>');
  //   return dateDisplay;
  // }

  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  
  function getHourtoUser() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var hora = $('<h6 id="lv-chatbox-date-display-user">'
        + h + ":" + m + '</h6>')
        .addClass("lv-chatbox-date-display-user");

    return hora;
  }

  function getHourtoBot() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var hora = $('<h6 id="lv-chatbox-date-display-bot">'
        + h + ":" + m + '</h6>')
        .addClass("lv-chatbox-date-display-bot");

    return hora;
  }

  var LiveloBuildChatBody = function () {
    var list = $('<ul>').attr({ 'id': 'lv-messages-list' })
      .addClass('lv-messages-list');
    var inner = $('<div>').addClass('inner')
      .append(list);
    var html = $('<div>').addClass('lv-chatbox-body')
      .attr({ 'id': 'lv-chatbox-body-messages' })
      // .append(LiveloBuildChatDateDisplay())
      .append(inner);
      if (originchannel==3 || originchannel=='03'||originchannel==4){ //Originchannel = 3 é qnd vem do APP
        html.css({"top":"0px"}); // remove o top do cabeçalho
      }
    return html;
  }

  var LiveloBuildChatFooter = function () {
    var input = $('<input>').attr({
      'type': 'text',
      'id': 'msg_to_send',
      'name': 'footer',
      'autocomplete': 'off',
      'placeholder': 'Escreva sua mensagem'
    });
    // var send = $('<div/>').attr({
    //   'id': 'send-msg',
    //   'alt': 'send-msg',
    //   'title': 'enviar mensagem'
    // })
    //   .append("<p>Enviar</p>")
    //   .addClass('lv-chatbox-sendbtn')
    //   .click(sendMessage);
      var logoimg = $('<img>').addClass('lv-chatbox-sendbtn')
      .attr({
        'data-gtm-event-category': 'pontoslivelo:geral',
        'data-gtm-event-action': 'click:ajuda-flutuante',
        'data-gtm-event-label': 'principal:abrir',
        // 'data-gtm-dimension35' : sessionCode,
        'src': origin_url + '/assets/icons/btn-Send.svg'
      })
      .click(sendMessage);
    var form = $('<form>').addClass('inner')
      .attr({ 'id': 'form_bot' })
      .append(input)
      .append(logoimg)
      .submit(sendMessage);
    var html = $('<div>').addClass('lv-chatbox-footer')
      .append(form);
    return html;
  }

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

  var LiveloBuildChat = function () {
    var html = $('<div>')
      // .addClass('lv-chatbox');
      if (originchannel == 3 || originchannel == '03' || originchannel==4){
      html
      .addClass('lv-chatbox-app')
      // .append(LiveloBuildChatHeader())
      .append(LiveloBuildChatBody())
      .append(LiveloBuildChatFooter())
      }
      else {
        html
        .addClass('lv-chatbox')
        .append(LiveloBuildChatHeader())
        .append(LiveloBuildChatBody())
        .append(LiveloBuildChatFooter());
      }
    var position = $('#livelo-everis-chat').attr('position');
    if (position) {
      html.attr({ 'position': position })
    }
    return html;
  };


  var isCarousel = function (options) {
    var carousel = false;
    for (var i = 0; i < options.length; i++) {
      var item = options[i];
      if (item['type'] == 'carrossel') {
        carousel = true;
      }
    }
    return carousel;
  }

  function answerHasBtnOptions(answer) {
    if (answer['options'] && answer.options.length > 0 && !isCarousel(answer.options)) {
      return true;
    }
    return false;
  }

  function technicalTextHasBtnEmail(technicalText) {
    if (technicalText && technicalText['send_email_btn_title']) {
      return true;
    }
    return false;
  }

  function technicalTextHasBtnTransfHuman(technicalText) {
    if (technicalText && technicalText['transf_human_btn_title']) {
      return true;
    }
    return false;
  }

  function technicalTextHasBtnForm(technicalText) {
    if (technicalText && technicalText['send_form_btn_title']) {
      return true;
    }
    return false;
  }

  var LiveloBuildMsgBotButtons = function (answer, session, context) {
    var html = '';
    var technicalText = (answer['technicalText'] ? answer['technicalText'] : {});
    technicalText = jQuery.type(technicalText) === 'string' ? JSON.parse(technicalText) : technicalText;
    var sessionCode = (session ? session : '');
    if (answerHasBtnOptions(answer) || technicalTextHasBtnEmail(technicalText) || technicalTextHasBtnTransfHuman(technicalText) || technicalTextHasBtnForm(technicalText)) {
      html = $('<ul>').addClass('lv-msg-list').addClass('lv-msg-buttons');
    }
    if (technicalTextHasBtnEmail(technicalText)) {
      var button = $('<button>')
        .addClass('lv-btn')
        .append(technicalText['send_email_btn_title'])
        .click(function () {
          setTabsActive('#lv-header-tab-right-send-email');
        });
      var wrap = $('<li>').append(button);
      html.append(wrap);
    }
    if (technicalTextHasBtnTransfHuman(technicalText)) {
      // console.log(technicalText);
      var button = $('<button>')
        .addClass('lv-btn')
        .addClass('gtm-element-event')
        .attr({
          'data-gtm-event-category' : 'pontoslivelo:geral',
	        'data-gtm-event-action' : 'click:ajuda-flutuante',
	        'data-gtm-event-label' : 'botao:comecar-a-conversa'
        })
        .append(technicalText['transf_human_btn_title'])
        .click(function () {
          setTabsActive('#lv-header-tab-right-transf-human');
        });
      var wrap = $('<li>').append(button);
      html.append(wrap);
    }
    if (technicalTextHasBtnForm(technicalText)) {
      // console.log(technicalText);
      var button = $('<button>')
        .attr({'id':'btn_toForm'})
        .addClass('lv-btn')
        .append(technicalText['send_form_btn_title'])
        .click(function () {
          setTabsActive('#lv-header-tab-right-swap');
        });
      var wrap = $('<li>').append(button);
      html.append(wrap);
    }
    if (answerHasBtnOptions(answer)) {
      for (var i = 0; i < answer.options.length; i++) {
        var btn = answer.options[i];
        var button = '';
        if (isLink(btn['text'])) {
          button = $('<a>')
            .attr({ 'href': btn['text'], 'target': '_blank' });
        } else {
          button = $('<button>')
            .click({ btn: btn, context: context.broker, sessionCode: sessionCode, technical: technicalText }, sendButtonMessage);
        }
        var initialbtntext = answer.options[i].text.substring(0,2);
        // console.log(initialbtntext);
        if ( initialbtntext == 'ci'){
          button.addClass('lv-btn-order').append(btn['title']);
        } else {
        button.addClass('lv-btn').append(btn['title']);
        }
        var wrap = $('<li>').append(button);
        html.append(wrap);
      }
    }
    return html;
  }

  var getAskedMsg = function (id) {
    var msg = globalDialogue[id - 1];
    return (msg ? msg['text'] : '');
  }

  var LiveloBuildMsgBotLike = function (id, technicalText, sessionCode, answered, asked, intent) {
    var html = '';
    var likeable = false;
    if (typeof (technicalText) === 'string' && technicalText !== 'loading') {
      var technicalTt = JSON.parse(technicalText);
      likeable = technicalTt['likeable'];
    }
    if (technicalText != 'loading' && likeable === 'true') {
      var like = $('<img/>').addClass('lv-msg-bot-like-icon-like')
        .click({ like: true, id: id, sessionCode: sessionCode, answered: answered, asked: asked, intent: intent }, evaluateMessage)
        .attr({ 'src': livelo_chat_icon_like_unselect });
      var unlike = $('<img/>').addClass('lv-msg-bot-like-icon-unlike')
        .click({ like: false, id: id, sessionCode: sessionCode, answered: answered, asked: asked, intent: intent }, evaluateMessage)
        .attr({ 'src': livelo_chat_icon_dislike_unselect });
      var iconswrap = $('<span>').addClass('lv-msg-bot-like-icons')
        .append(like)
        .append(unlike);
      var text = $('<span>').addClass('lv-msg-bot-like-text')
        .append('Consegui te ajudar ?');
      html = $('<div>').addClass('lv-msg-bot-like-wrap')
        .append(text)
        .append(iconswrap);
    }
    return html;
  }

  var pushMessageBot = (function () {
    "use strict"
    function pushMessageBot(dialogue_list, msg_obj, text, eumarray, tempo, tempoante, lastelem, firstelem, msgpadrao, ansf) {
      // for (var i = 0; i < msg_obj.answers.length; i++) { //Cada resposta ele coloca na variável ans
        // if (msg_obj.answers[1]==undefined){
        //   if (msg_obj.answers.length > 1){
        //   for (var i=0;i<msg_obj.answers.length-1;i++){
        //     if (msg_obj.answers[i].text == text){
        //       var ans = msg_obj.answers[i];
        //     }
        //   }
        // } else {
        //   var ans = msg_obj.answers[0]
        // }
        var ans = ansf;
        if (ans == undefined){
          var ans = msg_obj.answers[0]
        }
        // var ans = msg_obj.answers[0]; 
        // } else {
        // var ans = msg_obj.answers[1];
        // }
        // console.log(ans);
        var context = msg_obj['context'];
        // if (ans['title'] === "1000B_SAUDACAO" || ans['text'] === "1000B_SAUDACAO" || ans['title'] === "1000A_SAUDACAO" || ans['text'] === "1000A_SAUDACAO" || ans['title'] === "1005_BOAS_VINDAS" || ans['text'] === "1005_BOAS_VINDAS") {
        //   setSessionCode('');
        //   msg_obj.context = '';
        // }
        var id = globalDialogue.length;
        if (firstelem == true || msgpadrao == true){
          var wrap = $('<div>').addClass('lv-msg-wrap-bot');
      } else {
          var wrap = $('<div>').addClass('lv-msg-wrap-bot-square');
      }
        if (context) {
          if (eumarray == true){
          var msg = $('<p>').append(global_gifjson.answers[0]['text']);
          var btns = LiveloBuildMsgBotButtons(ans, msg_obj['sessionCode'], msg_obj['context']);
          var technicalTt = (ans['technicalText'] ? ans.technicalText : '{}');
          // var icon = $('<img/>').addClass('lv-msg-icon-livelo')
          // .attr({ 'src': origin_url + '/assets/icons/livelo.png' });
          var content = $('<div>')
          .attr({ 'id': 'lv-msg-bot-' + id })
          var dialogue = $('<li>')            
          setTimeout(function () { //animacçao do botao
            wrap.append(msg)
            if (firstelem == true){
            content
            // .append(icon)
           .append(wrap);
          } else {
            content.append(wrap);
          }   
        dialogue = $('<li>').append(content);
        dialogue_list.append(dialogue);
        $('#msg_to_send').prop('disabled', true);
      }, tempoante);
        
        setTimeout(function () { //animacçao do botao
         $('#chatTypingGif').remove();
         msg.append(text);
         wrap.append(msg);
         if (lastelem == true){
         wrap.append(btns)
         .append(LiveloBuildMsgBotLike(id, technicalTt, msg_obj['sessionCode'], ans['text'], getAskedMsg(id), context['intent']));
         }
         if (firstelem == true){
          content
          // .append(icon)
          .append(wrap);
         } else {
           content.append(wrap);
         }
         dialogue.append(content);
         receivemessage.play();
         scrollBottom();
         $('#msg_to_send').prop('disabled', false);
         $('#msg_to_send').focus();
         if(lastelem==true){
         dialogue.append(getHourtoBot());
        //  var div_btns = $('<div>')
        //  .attr({'id':'div_botoes'})
        //  .addClass('lv-chatbox-btns')
        //  .append(btns)
        //  dialogue.append(div_btns);
         }
        }, tempo);
         
          } else {
            msg = $('<p>').append(text);
            var btns = LiveloBuildMsgBotButtons(ans, msg_obj['sessionCode'], msg_obj['context']);
            var technicalTt = (ans['technicalText'] ? ans.technicalText : '{}');
            wrap.append(msg)
            .append(btns)
            .append(LiveloBuildMsgBotLike(id, technicalTt, msg_obj['sessionCode'], ans['text'], getAskedMsg(id), context['intent']));
        // var icon = $('<img/>').addClass('lv-msg-icon-livelo')
        //   .attr({ 'src': origin_url + '/assets/icons/livelo.png' });
        var content = $('<div>')
          .attr({ 'id': 'lv-msg-bot-' + id })
          // .append(icon)
          .append(wrap);
        var dialogue = $('<li>').append(content);
        dialogue.append(getHourtoBot());
        // var div_btns = $('<div>')
        // .attr({'id':'div_botoes'})
        // .addClass('lv-chatbox-btns')
        // .append(btns)
        // dialogue.append(div_btns);
        dialogue_list.append(dialogue);
        
          }
          
        } else {
          var msg = $('<p>').append(ans['text']);
          var btns = LiveloBuildMsgBotButtons(ans, msg_obj['sessionCode'], msg_obj['context']);
        var technicalTt = (ans['technicalText'] ? ans.technicalText : '{}');
          wrap.append(msg)
            .append(btns)
            .append(LiveloBuildMsgBotLike(id, technicalTt, msg_obj['sessionCode'], ans['text'], getAskedMsg(id)));
        // var icon = $('<img/>').addClass('lv-msg-icon-livelo')
        //   .attr({ 'src': origin_url + '/assets/icons/livelo.png' });
        var content = $('<div>')
          .attr({ 'id': 'lv-msg-bot-' + id })
          // .append(icon)
          .append(wrap);
        var dialogue = $('<li>').append(content);
        dialogue_list.append(dialogue);
        }

      // }
    }
    return pushMessageBot;
  })();

  //var LiveloBuildMsgBot = function (obj) {
  // var id = globalDialogue.length;
  //Trecho do Gregório que resolve o bug
  // if (globalDialogue.length >= 2 && obj.answers[0].title === "1000B_SAUDACAO" || obj.answers[0].text === "1000B_SAUDACAO"|| obj.answers[0].title === "1000A_SAUDACAO" || obj.answers[0].text === "1000A_SAUDACAO" || obj.answers[0].title === "1005_BOAS_VINDAS" || obj.answers[0].text === "1005_BOAS_VINDAS") {
  //   setSessionCode('');
  //   obj.sessionCode = '';
  //   obj.context = '';
  // }
  // var wrap = $('<div>').addClass('lv-msg-wrap-bot');
  // var likeText = '';
  // for (var i=0; i<obj.answers.length; i++) {
  //   var ans = obj.answers[i]; //Cada resposta ele coloca na variável ans
  //   var msg = $('<p>').append(ans.text);
  //   var btns = LiveloBuildMsgBotButtons(ans, obj['sessionCode'], obj['context']);
  //   wrap.append(msg).append(btns);
  //   likeText = likeText + (i>0? ',':'') + ans['text'];
  // }
  // var firstAnswer = obj.answers[0];
  // var technicalTt = (firstAnswer['technicalText']? firstAnswer.technicalText : '{}');
  // wrap.append(LiveloBuildMsgBotLike(id, technicalTt, obj['sessionCode'], likeText, getAskedMsg(id)));
  // var icon = $('<img/>').addClass('lv-msg-icon-livelo')
  //   .attr({'src': origin_url+'/assets/icons/livelo.png'});
  // var content = $('<div>')
  //   .attr({'id': 'lv-msg-bot-'+id})
  //   .append(icon)
  //   .append(wrap);
  // var html = $('<li>').append(content);
  // return html;
  //}

  var LiveloBuildMsgClient = function (obj) {
    var msg = $('<p>').text(obj.text);
      var inner = $('<div>').addClass('lv-msg-wrap-client').append(msg);
    var html = $('<li>').append(inner)
    // .append(getHourtoUser())
    // .css({'float':'right'});

    return html;
  }

  var evaluateMessage = (function () {
    "use strict";
    function evaluateMessage(event) {
      // console.log(event.data);
      var id = event.data.id;
      var message = {
        'text':'QUER_ATH_DISLIKE',
        'context':getLastContext()
      }
      var parent = $('#lv-msg-bot-' + id);
      if (parent.attr('voted') != 'voted') {
        var like = event.data.like;
        parent.attr({ 'voted': 'voted' });
        parent.find('.lv-msg-bot-like-text').html('Muito obrigado pela sua avaliação!');
        if (like) {
          var target = parent.find('.lv-msg-bot-like-icon-like');
          target.attr({ 'src': livelo_chat_icon_like_select });
        } else {
          var target = parent.find('.lv-msg-bot-like-icon-unlike');
          target.attr({ 'src': livelo_chat_icon_dislike_select });
          sendMsgToBroker(sessionCode, lastSessionCode, message);
        }
        var likeData = {
          'answered': event.data.answered,
          'asked': event.data.asked,
          'evaluation': (like ? 1 : 0),
          'intent': event.data.intent
        }
        sendLikeToBroker(event.data.sessionCode, likeData);
      }
    }
    return evaluateMessage;
  })();

  var sendLikeToBroker = (function () {
    "use strict";

    function sendLikeToBroker(sessionCode, likeData) {

      //esconde loading feio e intrometido do site da livelo
      var width = $(window).width();
      if (width >= 769) {
        $('.ldmain').hide();
        $('.ldimg').hide();
        // $('.ldmain').addClass("lv-hide-loading");

        // $('.ldimg').addClass("lv-hide-loading");
      }

      var endpoint = broker_endpoint + sessionCode + '/satisfaction';
      broker_headers["USER-REF"]=userIp;
      // $.ajaxSetup({
      //   headers: broker_headers
      // });
      $.ajax({
        headers: broker_headers,
        url: endpoint,
        dataType: 'json',
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(likeData),
        success: function (resp) {
          // console.log(resp)
          if (!resp) {
            // console.log('Ocorreu um erro.');
          }
          //mostra loading do site da livelo
          // var width = $(window).width();
          //   if (width>=769){
          //     // $('.ldmain').show();
          //     // $('.ldimg').show();
          //     //  $('.ldmain').removeClass("lv-hide-loading");

          //     // $('.ldimg').removeClass("lv-hide-loading");
          //    }
        },
        error: function (err) {
          // console.log('AQUI VAI O ERRO: ' + err);
          //mostra loading do site da livelo
          // var width = $(window).width();
          //    if (width>=769){
          //     $('.ldmain').show();
          //     $('.ldimg').show();
          //       // $('.ldmain').removeClass("lv-hide-loading");

          //       // $('.ldimg').removeClass("lv-hide-loading");
          //       }

        }
      });
    }

    return sendLikeToBroker;
  })();

  function contextHasCpf(context) {
    if (context['CustomerId']) { return true; }
    return false;
  }

  function contextHasProtocol(context) {
    if (context['protocolId']) {
      return true;
    }
    return false;
  }

  function contextHasCategoryID(context) {
    if (context['CategoryID']) {
      return true;
    }
    return false;
  }

  function isBotMsg(obj) {
    if (obj['answers']) {
      return true;
    }
    return false;
  }

  function isTransfHuman(obj) {
    if (obj['answers'] && obj.answers.length > 0) {
      for (var i = 0; obj.answers.length > i; i++) {
        var ans = obj.answers[i];
        var technicalText = jQuery.type(ans.technicalText) === 'string' ? JSON.parse(ans.technicalText) : ans.technicalText;
        if (technicalText && technicalText['chat_tab_human']) {
          return true;
        }
      }
    }
    return false;
  }

  function isFormErro(obj) {
    if (obj['answers'] && obj.answers.length > 0) {
      for (var i = 0; obj.answers.length > i; i++) {
        var ans = obj.answers[i];
        var technicalText = jQuery.type(ans.technicalText) === 'string' ? JSON.parse(ans.technicalText) : ans.technicalText;
        if (technicalText && technicalText['chat_form_erro']) {
          return true;
        }
      }
    }
    return false;
  }

  function isSendEmail(obj) {
    if (obj['answers'] && obj.answers.length > 0) {
      for (var i = 0; obj.answers.length > i; i++) {
        var ans = obj.answers[i];
        var technicalText = jQuery.type(ans.technicalText) === 'string' ? JSON.parse(ans.technicalText) : ans.technicalText;
        if (technicalText && technicalText['chat_tab_email']) {
          return true;
        }
      }
    }
    return false;
  }

  function isCancel(obj) {
    if (obj['answers'] && obj.answers.length > 0) {
      for (var i = 0; obj.answers.length > i; i++) {
        var ans = obj.answers[i];
        var technicalText = jQuery.type(ans.technicalText) === 'string' ? JSON.parse(ans.technicalText) : ans.technicalText;
        if (technicalText && technicalText['chat_tab_cancel']) {
          return true;
        }
      }
    }
    return false;
  }

  function isTrocaPacote(obj) {
    if (obj['answers'] && obj.answers.length > 0) {
      for (var i = 0; obj.answers.length > i; i++) {
        var ans = obj.answers[i];
        var technicalText = jQuery.type(ans.technicalText) === 'string' ? JSON.parse(ans.technicalText) : ans.technicalText;
        if (technicalText && technicalText['chat_tab_pack_change_viagens']) {
          return true;
        }
      }
    }
    return false;
  }

  function isTrocaViagem(obj) {
    if (obj['answers'] && obj.answers.length > 0) {
      for (var i = 0; obj.answers.length > i; i++) {
        var ans = obj.answers[i];
        var technicalText = jQuery.type(ans.technicalText) === 'string' ? JSON.parse(ans.technicalText) : ans.technicalText;
        if (technicalText && technicalText['chat_tab_ticket_change_viagens']) {
          return true;
        }
      }
    }
    return false;
  }

  function isTrocaHotel(obj) {
    if (obj['answers'] && obj.answers.length > 0) {
      for (var i = 0; obj.answers.length > i; i++) {
        var ans = obj.answers[i];
        var technicalText = jQuery.type(ans.technicalText) === 'string' ? JSON.parse(ans.technicalText) : ans.technicalText;
        if (technicalText && technicalText['chat_tab_hotel_change_viagens']) {
          return true;
        }
      }
    }
    return false;
  }

  function isTrocaCarro(obj) {
    if (obj['answers'] && obj.answers.length > 0) {
      for (var i = 0; obj.answers.length > i; i++) {
        var ans = obj.answers[i];
        var technicalText = jQuery.type(ans.technicalText) === 'string' ? JSON.parse(ans.technicalText) : ans.technicalText;
        if (technicalText && technicalText['chat_tab_car_change_viagens']) {
          return true;
        }
      }
    }
    return false;
  }

  function isMaskPhone(obj) {
    if (obj['answers'] && obj.answers.length > 0) {
      for (var i = 0; obj.answers.length > i; i++) {
        var ans = obj.answers[i];
        var technicalText = jQuery.type(ans.technicalText) === 'string' ? JSON.parse(ans.technicalText) : ans.technicalText;
        if (technicalText && technicalText['mask_phone']) {
          return true;
        }
      }
    }
    return false;
  }

  function isNotLoading(obj) {
    if (obj && obj['technicalText'] != 'loading') {
      return true;
    }
    return false;
  }

  var pushNewMessage = (function () {
    "use strict";
    function pushNewMessage(obj, text, eumarray, tempo, tempoante, lastelem, firstelem, msgpadrao, ansf) {
      var messagesList = $('#lv-messages-list'); //FL conversa do chat


      if (isBotMsg(obj)) { //mensagem do bot (vinda do broker)
        if (isTransfHuman(obj)) {
          changeLayoutToHuman(obj.context['front']);
        }
        if (isSendEmail(obj)) {
          changeLayoutToSendEmail(obj.context['front']);
        }
        if (isCancel(obj)) {
          changeLayoutToCancel(obj.context['front']);
        }

        if (isTrocaPacote(obj)) {
          changeLayoutToTrocaPacote(obj.context['front']);
        }

        if (isTrocaViagem(obj)) {
          changeLayoutToTrocaViagem(obj.context['front']);
        }

        if (isTrocaHotel(obj)) {
          changeLayoutToTrocaHotel(obj.context['front']);
        }

        if (isTrocaCarro(obj)) {
          changeLayoutToTrocaCarro(obj.context['front']);
        }

        if (isMaskPhone(obj)) {
          changeInputMaskToPhone();
        } else {
          $(document).off('keyup', '#msg_to_send');
          $('#msg_to_send')
          .attr({"placeholder":"Escreva sua mensagem"})
          .removeAttr('maxlength')
        }

        pushMessageBot(messagesList, obj, text, eumarray, tempo, tempoante, lastelem, firstelem, msgpadrao, ansf);
      } else { //mensagem de cliente (digitada pelo usuário)
        messagesList.append(LiveloBuildMsgClient(obj))
        .append(getHourtoUser())
        if (form_next_action){
          removeRightLayout();
          document.getElementById("btn_toForm").setAttribute("disabled", "disabled"); 
          document.getElementById("btn_toForm").setAttribute("id", "btn_toForm_old");   
          $('.lv-chatbox-body-tabs').removeClass('lv-chatbox-body-tabs');
          form_next_action = false;
        }
      }
      if (isNotLoading(obj)) { globalDialogue.push(obj); }
      scrollBottom();
    }
    return pushNewMessage;
  })();


  var removeRightLayout = (function () {
    "use strict";
    function removeRightLayout() {
      human_layout = true;
      send_email_layout = true;
      cancel_layout = true;
      troca_layout = true;
      var iframe = $(".lv-chatbox-body-iframe");
      var tabs = $(".lv-tabs");
      if(originchannel==3 || originchannel==4){
        tabs.css({
          'z-index':'3',
          'top':'0px'
        })
      }
      var formulario = $("#div1_BodyLiveloViagens1");
      var ajaxerro = $("#ajaxerro");
      var ajaxsucesso = $("#ajaxsucesso");
      var ajaxerroout = $("#ajaxerroout");
      var evaluationbot = $('#evaluationbot');
      if (iframe) { iframe.remove(); }
      if (tabs) { tabs.remove(); }
      if (formulario) { formulario.remove(); }
      if (ajaxerro) { ajaxerro.remove(); }
      if (ajaxerroout) { ajaxerroout.remove(); }
      if (ajaxsucesso) { ajaxsucesso.remove(); }
      if (evaluationbot) { evaluationbot.remove(); }
    }
    return removeRightLayout;
  })();

  // var isAvaliacaoBot = (function(){
  //   "use strict";
  //   function isAvaliacaoBot(){
  //     var chatboxBody = $('#lv-chatbox-body-messages');
  //       chatboxBody.addClass('lv-chatbox-body-tabs-evaluation');
  //       chatboxBody.removeClass('lv-chatbox-body-tabs');
  //       $('.lv-chatbox').addClass('lv-chatbox-tabs');
  //       // LiveloBuildChatHeaderTabsTransfHuman().insertAfter($('.lv-chatbox-header'));
  //       LiveloBuildChatHeaderBot().insertAfter($('.lv-chatbox-body'));
  //   }
  //   return isAvaliacaoBot;
  // })();

  var changeInputMaskToPhone = (function () {
    "use strict";
    function changeInputMaskToPhone() {

      function mascara(o,f){
        var v_obj=o
        var v_fun=f
        setTimeout(execmascara(v_obj,v_fun),1)
    }
    function execmascara(v_obj, v_fun){
        v_obj.value=v_fun(v_obj.value)
    }
    function mtel(v){
        v=v.replace(/\D/g,"");             //Remove tudo o que não é dígito
        v=v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
        v=v.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
        return v;
    }
    
      $(document).on('keyup', '#msg_to_send', function(){
        console.log('teste')
        mascara( this, mtel );
      });
      $('#msg_to_send')
      .attr({'placeholder':'DDD + Número','name':'telefone','maxlength':'15'})
    };
    return changeInputMaskToPhone;

  })();

  var changeLayoutToHuman = (function () {
    "use strict";
    function changeLayoutToHuman(context) {
      //esconde loading feio e intrometido do site da livelo

      var width = $(window).width();
      if (width >= 769) {
        $('.ldmain').hide();
        $('.ldimg').hide();
        // $('.ldmain').addClass("lv-hide-loading");

        // $('.ldimg').addClass("lv-hide-loading");
      }


      if (human_layout && contextHasCpf(context) && contextHasProtocol(context) && contextHasCategoryID(context)) {
        removeRightLayout();
        human_layout = false;
        var chatboxBody = $('#lv-chatbox-body-messages');
        chatboxBody.addClass('lv-chatbox-body-tabs');
        chatboxBody.removeClass('lv-chatbox-body-tabs-evaluation');
        $('.lv-chatbox').addClass('lv-chatbox-tabs');
        // LiveloBuildChatHeaderTabsTransfHuman().insertAfter($('.lv-chatbox-header'));
        LiveloBuildChatHeaderTabsTransfHuman().insertBefore($('.lv-chatbox-body'));
        if (originchannel==3 || originchannel==4){
          var channelneo = 3
          LiveloBuildChatBodyIframeTransfHuman('', '', context.CustomerId, context.protocolId, context.CategoryID, channelneo).insertAfter(chatboxBody); //'37837928865'; //19473689071
        } else if (width<=768){
          var channelneo = 2
          LiveloBuildChatBodyIframeTransfHuman('', '', context.CustomerId, context.protocolId, context.CategoryID, channelneo).insertAfter(chatboxBody); //'37837928865'; //19473689071
        } else {
        LiveloBuildChatBodyIframeTransfHuman('', '', context.CustomerId, context.protocolId, context.CategoryID).insertAfter(chatboxBody); //'37837928865'; //19473689071
        }
        setTabsActive('#lv-header-tab-right-transf-human');
        // nmsguser = 0;
      }
    };
    return changeLayoutToHuman;
  })();

  var changeLayoutToSendEmail = (function () {
    "use strict";
    function changeLayoutToSendEmail(context) {
      if (send_email_layout) {
        removeRightLayout();
        send_email_layout = false;
        var chatboxBody = $('#lv-chatbox-body-messages');
        chatboxBody.addClass('lv-chatbox-body-tabs');
        chatboxBody.removeClass('lv-chatbox-body-tabs-evaluation');
        $('.lv-chatbox').addClass('lv-chatbox-tabs');
        // LiveloBuildChatHeaderTabsSendEmail().insertAfter($('.lv-chatbox-header'));
        LiveloBuildChatHeaderTabsSendEmail().insertBefore($('.lv-chatbox-body'));
        LiveloBuildChatBodyIframeSendEmail('', '', context.CustomerId).insertAfter(chatboxBody);
        setTabsActive('#lv-header-tab-left-send-email');
        // nmsguser = 0;
      }
    };
    return changeLayoutToSendEmail;

  })();

  var changeLayoutToCancel = (function () {
    "use strict";

    function changeLayoutToCancel(context) {
      // console.log(context)
      if (cancel_layout) {
        removeRightLayout();
        // cancel_layout = false;
        var chatboxBody = $('#lv-chatbox-body-messages');
        chatboxBody.addClass('lv-chatbox-body-tabs');
        chatboxBody.removeClass('lv-chatbox-body-tabs-evaluation');
        $('.lv-chatbox').addClass('lv-chatbox-tabs');
        // LiveloBuildChatHeaderTabsLiveloViagensCancelamento().insertAfter($('.lv-chatbox-header'));
        LiveloBuildChatHeaderTabsLiveloViagensCancelamento().insertBefore($('.lv-chatbox-body'));
        LiveloBuildChatBodyLiveloViagensCancel(context).insertAfter(chatboxBody);
        setTabsActive('#lv-header-tab-left-swap');
        // nmsguser = 0;
        form_next_action = true;
      }
    };
    return changeLayoutToCancel;

  })();

  var changeLayoutToTrocaPacote = (function () {
    "use strict";

    function changeLayoutToTrocaPacote(context) {
      if (troca_layout) {
        removeRightLayout();
        // troca_layout = false;
        var chatboxBody = $('#lv-chatbox-body-messages');
        chatboxBody.addClass('lv-chatbox-body-tabs');
        chatboxBody.removeClass('lv-chatbox-body-tabs-evaluation');
        $('.lv-chatbox').addClass('lv-chatbox-tabs');
        // LiveloBuildChatHeaderTabsLiveloViagensTroca().insertAfter($('.lv-chatbox-header'));
        LiveloBuildChatHeaderTabsLiveloViagensTroca().insertBefore($('.lv-chatbox-body'));
        LiveloBuildChatBodyLiveloViagensTrocaPacote(context.front).insertAfter(chatboxBody);
        setTabsActive('#lv-header-tab-left-swap');
        // nmsguser = 0;
        form_next_action = true;
      }
    };
    return changeLayoutToTrocaPacote;

  })();

  var changeLayoutToTrocaViagem = (function () {
    "use strict";

    function changeLayoutToTrocaViagem(context) {
      if (troca_layout) {
        removeRightLayout();
        // troca_layout = false;
        var chatboxBody = $('#lv-chatbox-body-messages');
        chatboxBody.addClass('lv-chatbox-body-tabs');
        chatboxBody.removeClass('lv-chatbox-body-tabs-evaluation');
        $('.lv-chatbox').addClass('lv-chatbox-tabs');
        // LiveloBuildChatHeaderTabsLiveloViagensTroca().insertAfter($('.lv-chatbox-header'));
        LiveloBuildChatHeaderTabsLiveloViagensTroca().insertBefore($('.lv-chatbox-body'));
        LiveloBuildChatBodyLiveloViagensTrocaViagem(context.front).insertAfter(chatboxBody);
        setTabsActive('#lv-header-tab-left-swap');
        // nmsguser = 0;
        form_next_action = true;
      }
    };
    return changeLayoutToTrocaViagem;

  })();

  var changeLayoutToTrocaHotel = (function () {
    "use strict";

    function changeLayoutToTrocaHotel(context) {
      if (troca_layout) {
        removeRightLayout();
        // troca_layout = false;
        var chatboxBody = $('#lv-chatbox-body-messages');
        chatboxBody.addClass('lv-chatbox-body-tabs');
        chatboxBody.removeClass('lv-chatbox-body-tabs-evaluation');
        $('.lv-chatbox').addClass('lv-chatbox-tabs');
        // LiveloBuildChatHeaderTabsLiveloViagensTroca().insertAfter($('.lv-chatbox-header'));
        LiveloBuildChatHeaderTabsLiveloViagensTroca().insertBefore($('.lv-chatbox-body'));
        LiveloBuildChatBodyLiveloViagensTrocaHotel(context.front).insertAfter(chatboxBody);
        setTabsActive('#lv-header-tab-left-swap');
        // nmsguser = 0;
        form_next_action = true;
      }
    };
    return changeLayoutToTrocaHotel;

  })();

  var changeLayoutToTrocaCarro = (function () {
    "use strict";

    function changeLayoutToTrocaCarro(context) {
      if (troca_layout) {
        removeRightLayout();
        // troca_layout = false;
        var chatboxBody = $('#lv-chatbox-body-messages');
        chatboxBody.addClass('lv-chatbox-body-tabs');
        chatboxBody.removeClass('lv-chatbox-body-tabs-evaluation');
        $('.lv-chatbox').addClass('lv-chatbox-tabs');
        // LiveloBuildChatHeaderTabsLiveloViagensTroca().insertAfter($('.lv-chatbox-header'));
        LiveloBuildChatHeaderTabsLiveloViagensTroca().insertBefore($('.lv-chatbox-body'));
        LiveloBuildChatBodyLiveloViagensTrocaCarro(context.front).insertAfter(chatboxBody);
        setTabsActive('#lv-header-tab-left-swap');
        // nmsguser = 0;
        form_next_action = true;
      }
    };
    return changeLayoutToTrocaCarro;

  })();

  function btntryagain(){
    // "use strict";

    var lastc = getLastContext();
    var ajaxerro = $("#ajaxerro");
    var ajaxerroout = $("#ajaxerroout");
    if (ajaxerro) { ajaxerro.remove(); }
    if (ajaxerroout) { ajaxerroout.remove(); }

    if (lastc.front.Formulario == "cancelar"){
    changeLayoutToCancel(lastc.front);
    setTabsActive('#lv-header-tab-right-swap');
    }
    if (lastc.front.Formulario == "trocapacote"){
      changeLayoutToTrocaPacote(lastc.front);
      setTabsActive('#lv-header-tab-right-swap');
    }
    if (lastc.front.Formulario == "trocapassagem"){
      changeLayoutToTrocaViagem(lastc).front;
      setTabsActive('#lv-header-tab-right-swap');
    }
    if (lastc.front.Formulario == "trocahotel"){
      changeLayoutToTrocaHotel(lastc.front);
      setTabsActive('#lv-header-tab-right-swap');
    }
    if (lastc.front.Formulario == "trocacarro"){
      changeLayoutToTrocaCarro(lastc.front);
      setTabsActive('#lv-header-tab-right-swap');
    }
    
  return btntryagain;
}

  var clickTabsActive = (function () {
    "use strict";
    function clickTabsActive(event) {
      setTabsActive(event.data.target)
    }
    return clickTabsActive;
  })();

  // var clickCloseSatisfacao = (function () {
  //   "use strict";
  //   function clickCloseSatisfacao() {
  //     var evaluationbot = $('#evaluationbot');
  //     if (evaluationbot) { 
  //       evaluationbot.remove();
  //       evaluation_layout = false;
  //       $('#lv-chatbox-body-messages').removeClass('lv-chatbox-body-tabs');
  //       $('#lv-chatbox-body-messages').removeClass('lv-chatbox-body-tabs-evaluation');
  //     }
  //   }
  //   return clickCloseSatisfacao;
  // })();

  var setTabsActive = (function () {
    "use strict";
    function setTabsActive(target) {
      $('.lv-tabs-wrap').removeClass('active');
      $(target).addClass('active');
      if ((target == '#lv-header-tab-left-transf-human') || (target == '#lv-header-tab-left-send-email')) {
        $('.lv-chatbox-footer').css({ 'left': '0', 'opacity': '1' });
        $('.lv-chatbox-body').css({ 'left': '0', 'opacity': '1' });
        $('.lv-chatbox-body-iframe').css({ 'left': '100%', 'opacity': '0' });
      }
      if ((target == '#lv-header-tab-right-transf-human') || (target == '#lv-header-tab-right-send-email')) {
        $('.lv-chatbox-footer').css({ 'left': '-100%', 'opacity': '0' });
        $('.lv-chatbox-body').css({ 'left': '-100%', 'opacity': '0' });
        $('.lv-chatbox-body-iframe').css({ 'left': '0', 'opacity': '1' });
      }
      if ((target == '#lv-header-tab-right-swap')) {
        $('.lv-chatbox-footer').css({ 'left': '-100%', 'opacity': '0', 'margin':'0' });
        $('.lv-chatbox-body').css({ 'left': '-100%', 'opacity': '0' });
        $('.lv-chatbox-body-iframe').css({ 'left': '0', 'opacity': '1' });
      }
      if ((target == '#lv-header-tab-left-swap')) {
        $('.lv-chatbox-footer').css({ 'left': '0', 'opacity': '1', 'margin':'0' });
        $('.lv-chatbox-body').css({ 'left': '0', 'opacity': '1' });
        $('.lv-chatbox-body-iframe').css({ 'left': '100%', 'opacity': '0' });
      }
    }
    return setTabsActive;
  })();

  var afterMsgSent = (function () {
    "use strict";
    function afterMsgSent(code) {
      disableTyping();
      $('#msg_to_send').prop('disabled', false);
      sendInputAble = true;
      $('#msg_to_send').focus();
      //mostra loading do site da livelo

      //   var width = $(window).width();
      //   if (width>=769){
      //     $('.ldmain').show();
      //     $('.ldimg').show();
      //     // $('.ldmain').removeClass("lv-hide-loading");

      //     // $('.ldimg').removeClass("lv-hide-loading");
      //  }

    }
    return afterMsgSent;
  })();

  var scrollBottom = (function () {
    "use strict";
    function scrollBottom() {
      var height = $('.lv-chatbox-body .inner').height();
      $('.lv-chatbox-body').animate({ scrollTop: height }, 'slow');
    }
    return scrollBottom;
  })();

  var disableTyping = (function () {
    "use strict";
    function disableTyping() {
      $('#chatTypingGif').closest('li').remove();
    }
    return disableTyping;
  })();

  var sendMsgToBrokerWithSessionCode = (function () {
    "use strict";
    function sendMsgToBrokerWithSessionCode(message, push) {
      if (push) {
        pushNewMessage(message);
        sentmessage.play(); //audio do chat
      }
      sendMsgToBroker(getSessionCode(), getLastSessionCode(), message);
    };
    return sendMsgToBrokerWithSessionCode;
  })();

  var sendMsgToBroker = (function () {
    "use strict";

    function sendMsgToBroker(sessionCode, lastSessionCode, message) {
      nmsguser++;
      // console.log('incrementou '+nmsguser)
      //   if (nmsguser > 4 && evaluation_layout){
      //     removeRightLayout();
      //     isAvaliacaoBot();
      //   }
      if (sendInputAble) {

        $('#msg_to_send').prop('disabled', true);
        sendInputAble = false;

        pushNewMessage(global_gifjson); //constroi o gif de loading

        var endpoint = broker_endpoint + sessionCode;
        // $.ajaxSetup({
        //   headers: broker_headers
        // });

        //esconde loading feio e intrometido do site da livelo
        var width = $(window).width();
        if (width >= 769) {
          $('.ldmain').hide();
          $('.ldimg').hide();
          // $('.ldmain').addClass("lv-hide-loading");

          // $('.ldimg').addClass("lv-hide-loading");
        }

        broker_headers["USER-REF"]=userIp;
        $.ajax({
          headers: broker_headers,
          url: endpoint,
          dataType: 'json',
          type: 'post',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(message),
          beforeSend: function () {
            if (flash == true) {
              var chatboxBody = $('#lv-chatbox-body-messages');
              SolicitacaoLoading().insertAfter(chatboxBody);
              //Fazer o loading aparecer
            }
          },
          success: function (resp) {
            // console.log(isFormErro(messagetech));
            if (flash == true && isFormErro(resp)) {
              $('#tela_loading').remove();
              btntryagain();
              // var chatboxBody = $('#lv-chatbox-body-messages');
              // SolicitacaoErroOut(resp).insertAfter(chatboxBody);
              if (resp.context.front.Motivo_cancelamento){   
                $('#lv-tab-textarea').val(resp.context.front.Motivo_cancelamento);
              }

              if (resp.context.front.CustomerId == "InvalidCustomerId"){
              $('#cpf').addClass('lv-tab-bot-naovalido');
              var paravalid = $('<p>CPF incorreto, digite um CPF válido.</p>')
              .css({
                'margin-left': '7px',
                'font-size': '9px',
                'margin-top': '-7px',
                'color':'red',
                'margin-bottom':'5px'
              })
              .attr({'id':'validacaocpf'});
              paravalid.insertAfter($('#cpf'));
            } else {
              $('#cpf').val(resp.context.front.CustomerId);
            }

              if (resp.context.front.isPedido == "false"){
              $('#tab_numero_pedido').addClass('lv-tab-bot-naovalido');
              var paravalid = $('<p>Número do pedido incorreto, digite um número de pedido válido.</p>')
              .css({
                'margin-left': '7px',
                'font-size': '9px',
                'margin-top': '-7px',
                'color':'red',
                'margin-bottom':'5px'
              })
              .attr({'id':'validacaocpf'});
              paravalid.insertAfter($('#tab_numero_pedido'));
            }


              flash = false;
              afterMsgSent(message['code']);
            } else if (flash == true) {
              // console.log(message);
              var chatboxBody = $('#lv-chatbox-body-messages');
              if (resp.context.front.isPedido==undefined || resp.context.front.isPedido=="false"){
                SolicitacaoErro().insertAfter(chatboxBody);
              } else {
              SolicitacaoSucesso(resp).insertAfter(chatboxBody);
              }
              flash = false;
              afterMsgSent(message['code']);
              var msgpadrao = true;
              pushNewMessage(resp, resp.answers[0].text, null, null, null, null, null, msgpadrao);
            } else {
              if (resp) {
                // resp.answers[0].text = [["Se você quer ganhar pontos todos os meses, trocá-los por milhares de produtos com descontos exclusivos", 0], ["e ter muitas outras vantagens, o Clube Livelo foi feito pra você!",2000], ["É bem fácil assinar! Faz login no nosso site e vai em Juntar Pontos > Assinando o Clube Livelo. Escolha o melhor Clube pra você e clica em assinar plano.", 4000], ["Depois disso, é só aproveitar as vantagens do Clube. ;D", 6000]];
                // console.log(resp)
                for (var u = 0; u < resp.answers.length; u++){ 
                // debugger;
                var baloons = SpeechBalloons(resp.answers[u].text, tags);
                // console.log(baloons)
                // debugger;
                if (baloons.length > 1) {
                  var eumarray = true;
                  for (var i = 0; i < baloons.length; i++) {
                    if ( i == 0 ){
                      var firstelem = true;
                    } else {
                      firstelem = false;
                    }
                    if ( i + 1 == baloons.length){
                      var lastelem = true;
                    }
                    if (i>0){
                      pushNewMessage(resp, baloons[i][0], eumarray, baloons[i][1], baloons[i-1][1],lastelem, firstelem,null, resp.answers[u]);
                    } else {
                      pushNewMessage(resp, baloons[i][0], eumarray, baloons[i][1],null,null,firstelem,null, resp.answers[u]);
                    }

                    receivemessage.play();
                    setLastSessionCode(getSessionCode());
                    setSessionCode(resp['sessionCode']);
                  }
                }
                if (baloons.length == 1) {
                  var msgpadrao = true;
                  pushNewMessage(resp, resp.answers[u].text, null, null, null, null, null, msgpadrao,resp.answers[u]);
                  receivemessage.play();
                  setLastSessionCode(getSessionCode());
                  setSessionCode(resp['sessionCode']);
                }
              }
              } else {
                // console.log('Ocorreu um erro.');
                pushNewMessage(global_errorMsg);
              }
              afterMsgSent(message['code']);
              msgpadrao = false;
            }
            msgpadrao = false;
          },
          error: function (err) {
            var chatboxBody = $('#lv-chatbox-body-messages');
            if (flash == true) {
              SolicitacaoErro().insertAfter(chatboxBody);
              flash = false;
              afterMsgSent(message['code']);
              //Mostra a tela de erro
            } else {
              // console.log(err);
              pushNewMessage(global_errorMsg);
              afterMsgSent(message['code']);
            }
          }
        });

      }
    };

    return sendMsgToBroker;
  })();

  var sendNPSToBroker = (function () {
    "use strict";

    function sendNPSToBroker(sessionCode, message) {

        var endpoint = broker_endpoint + sessionCode + '/nps';


        var width = $(window).width();
        if (width >= 769) {
          $('.ldmain').hide();
          $('.ldimg').hide();
        }
        broker_headers["USER-REF"]=userIp;
        $.ajax({
          headers: broker_headers,
          url: endpoint,
          dataType: 'json',
          type: 'post',
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify(message),
          beforeSend: function () {
            
          },
          success: function (resp) {
            // console.log(resp);
            if (!npssemvoto){
              var logo = $('<img>').addClass('gtm-element-event')
              .attr({
                // 'data-gtm-dimension35' : sessionCode,
                'src': origin_url + '/assets/icons/IconBot_5x.png',
                'id': 'chat-livelo-logo-tchau'
              })
              .css({'height':'58px','width':'58px'});

              var logowrap = $('<div>').addClass('lv-chatbox-menu-logo')
              .append(logo)
              // .click(buildHtmlChat);
              var width = $(window).width();
              // if (width >= 769) {
              //     var logoOpen = $('<div>').addClass('lv-chatbox-menu-logo-open')
              //     .append('<p id="msg_tchau" style="margin-left:73px" class="lv-chatbox-menu-logo-open-parag">Valeu!</p>');
              //     // alert(originchannel + ' é um ' + typeof(originchannel));
              // }

              function canIHelpYouTag() {
                var width = $(window).width();
                if (width >= 769) {
                  setTimeout(function () { //animacçao do botao
                    $('p.lv-chatbox-menu-logo-open-parag').fadeOut();
                    $('div.lv-chatbox-menu-logo-open').css({
                    "width": "60px",
                    "transition": "width 1s",
                    "box-shadow": "none"
                  });
                  }, 3000);
                  setTimeout(function () { //ajuste do sombreamento depois da animação
                    html.remove();
                  }, 4000);
                }
              }

              var html = $('<div>').addClass('lv-chatbox-menu')
              .addClass('lv-chatbox-menu-visible')
              if (originchannel==3 || originchannel==4){
                html.append(buildHtmlChat)
              } else {
                html
                .append(logowrap)
                .append(logoOpen)
                .append(canIHelpYouTag());
                } 

              var position = $('#livelo-everis-chat').attr('position');
              if (position) {
                html.attr({ 'position': position })
              };

              $('#livelo-everis-chat').append(html);
    

             }

        npssemvoto=false;
            
          },
          error: function (err) {
              // console.log(err);
          }
        });
    };

    return sendNPSToBroker;
  })();


  var isLink = function (string) {
    return (string.substring(0, 4) == 'http');
  }

  var isPhone = function (string) {
    // var firstCharacters = string.substring(0, string.indexOf('-'));
    var lastCharacters = string.substring(string.indexOf('-') + 1, string.length);
    // var matches = firstCharacters.match(/[x]\d{4,}/g);
    // var valorX = "x";
    var tudoIgual = function iSAllCharsEqual(string, valorX) {
      for (i = 0; i < string.length; i++) {
        if ((string.substr(i, 1) != valorX)) {
          return false;
        }
      }
      return true;
    }
    if (tudoIgual) {
      if (!isNaN(lastCharacters)) {
        return true;
      }
    }
  }

  var sendButtonMessage = (function () {
    "use strict";
    function sendButtonMessage(event) {
      var technicalText = jQuery.type(event.data.technical) === 'string' ? JSON.parse(event.data.technical) : event.data.technical;
      var btn = event.data.btn;
      var text = isLink(btn['text']) ? '' : btn['text'];
      var sessionCode = event.data.sessionCode;
      var context = getLastContext(); //event.data.context
      var title = isLink(btn['title']) ? '' : btn['title'];
      var isTelephone = isPhone(title);
      var message = {
        'text': '',
        'context': context
      };
      if (isTelephone) {
        if (technicalText['ChatBot_ButtonReturnField']) { //comportamento específico de botão
          context[technicalText.ChatBot_ButtonReturnField] = text;
          message.context = context;
        } else { //comportamento padrão do botão
          message.text = text;
        }
      } else {
        message.context = context;
        message.text = text
      }
      sendMsgToBroker(sessionCode, sessionCode, message);
    }
    return sendButtonMessage;
  })();

  var getLastContext = function () {
    var lastMsg = globalDialogue[globalDialogue.length - 1];
    var lastcontext = {};
    if (lastMsg && lastMsg['context']) {
      lastcontext = lastMsg['context'];
    }
    return lastcontext;
  }


  var sendMessage = (function () {
    "use strict";
    function sendMessage(msgToSend) {
      var input = $('#msg_to_send'); //monitora evento no submit do usuario
      var message = {
        'text': (typeof (msgToSend) == 'string' ? msgToSend : input.val()),
        'context': getLastContext()
      };
      if (input.val() != '' && resolvefacilbot != true) {
        sendMsgToBrokerWithSessionCode(message, true); //se recebeu algo no submit do usuario
        input.val('');
      }
      //}
    }
    return sendMessage;
  })();

  var hideMenu = (function () {
    'use strict'
    function hideMenu() {
      $('.lv-chatbox-menu').removeClass('lv-chatbox-menu-visible');
    }
    return hideMenu;
  })();

  var buildHtmlChat = (function () {
    'use strict'
    function buildHtmlChat() {
      chatbot_active = true;
      // resolvefacilbot = true; //flag para ativar resolvefacil
      if (zerarcontador){
      nmsguser=0;
      }
      zerarcontador=false;
      if (createChat) {
        if (originchannel==4){
          resgatebraseguros = true
        }
        nps_layout=true;
        createChat = false;
        if (createChatNPS){
        $('#livelo-everis-chat').append(LiveloBuildChat());
        }
        if ((originchannel == 3 || origin_url == '.' || originchannel == 2|| !$('.user-name').length || originchannel == 1) && resolvefacilbot == false && resgatebraseguros == false)  {
        sendMsgToBroker('', '', { 'text': '', 'context': {'broker':{'botdata':'vazio', 'originchannel':originchannel},'front':{}} });
        } else if((originchannel == 3 || origin_url == '.' || originchannel == 2|| !$('.user-name').length || originchannel == 1) && resolvefacilbot == true){
          sendMsgToBroker('', '', { 'code': 'RESOLVE_FACIL', 'context': {'broker':{'botdata':'vazio', 'originchannel':originchannel},'front':{}} });
          setTimeout(() => {
            sendMsgToBroker(sessionCode, lastSessionCode,{'text': '6001_TRANSFERE_ATH','context': getLastContext()});
            resolvefacilbot = false;
          }, 2500);
        } else if(resolvefacilbot == true) {
          sendMsgToBroker('', '', { 'code': 'RESOLVE_FACIL_LOG', 'context': {'broker':{'botdata':botdata, 'originchannel':originchannel},'front':{}} });
          setTimeout(() => {
            sendMsgToBroker(sessionCode, lastSessionCode,{'text': '6001_TRANSFERE_ATH','context': getLastContext()});
            resolvefacilbot = false;
          }, 2500);
        } else if ((originchannel == 3 || origin_url == '.' || originchannel == 2|| !$('.user-name').length || originchannel == 1) && resgatebraseguros == true){
          sendMsgToBroker('', '', { 'text': 'RESG_BRAD_DESLOG', 'context': {'broker':{'botdata':'vazio', 'originchannel':originchannel},'front':{}} });
        } else if (resgatebraseguros == true){
          sendMsgToBroker('', '', { 'text': 'RESG_BRAD_LOG ', 'context': {'broker':{'botdata':botdata, 'originchannel':originchannel},'front':{}} });
      
        } else {
          sendMsgToBroker('', '', { 'text': '', 'context': {'broker':{'botdata':botdata, 'originchannel':originchannel},'front':{}} });
        }
        resgatebraseguros = false;
        $('#form_bot').submit(function (event) {
          event.preventDefault(); //prevent from reloading
        });
      }
      if (originchannel==3 || originchannel=='03'){
        $('.lv-chatbox-app').addClass('lv-chatbox-visible')
        .css({'bottom': '0px'});
        $('#form_bot').css({ 'margin-bottom': '0px'});
      } else {
      $('.lv-chatbox').addClass('lv-chatbox-visible');
      }
      hideMenu();
    }
    return buildHtmlChat;
  })();

  //a linha a seguir eh o que constroi o html do chat
  $('#livelo-everis-chat').append(LiveloBuildMenu());

  // posicionamento da caixa do chatbot - apenas para teste
  $("#esq-cima").click(function () {
    $('.lv-chatbox-menu').attr({ 'position': 'left-top' });
    $('.lv-chatbox').attr({ 'position': 'left-top' });
    $('.lv-phoneinfo').attr({ 'position': 'left-top' });
    $('.lv-emailform').attr({ 'position': 'left-top' });
  });
  $("#esq-baixo").click(function () {
    $('.lv-chatbox-menu').attr({ 'position': 'left-bottom' });
    $('.lv-chatbox').attr({ 'position': 'left-bottom' });
    $('.lv-phoneinfo').attr({ 'position': 'left-bottom' });
    $('.lv-emailform').attr({ 'position': 'left-bottom' });
  });
  $("#dir-cima").click(function () {
    $('.lv-chatbox-menu').attr({ 'position': 'right-top' });
    $('.lv-chatbox').attr({ 'position': 'right-top' });
    $('.lv-phoneinfo').attr({ 'position': 'right-top' });
    $('.lv-emailform').attr({ 'position': 'right-top' });
  });
  $("#dir-baixo").click(function () {
    $('.lv-chatbox-menu').attr({ 'position': 'right-bottom' });
    $('.lv-chatbox').attr({ 'position': 'right-bottom' });
    $('.lv-phoneinfo').attr({ 'position': 'right-bottom' });
    $('.lv-emailform').attr({ 'position': 'right-bottom' });
  });


 //[[TEXTO_DO_TAG,NUMERO_DE_VEZES_MAXIMAS_OU_CHAR_QUE_INDICA_O_FINAL],["TextoDeQuebraDeBalao",2],["<comando=",">"],...]
//Ordenado por prioridade.
var tags = [["<delay=",">"],["<br>",3]];
var WordsPerMinute = 200;

//retorna a se existe o "tag" no texto.
function HaveTag(pl,tag) {
    if (pl ==-1){
        return false;
    }
    if (pl.indexOf(tag)==-1) {
    	return false;
    }else{
    	return true;
	}
}

function replaceAll(texto, esse, porEsse) {
    return texto.split(esse).join(porEsse);
}

//retorna a quantidade de "tags" encontrados
function HowManyTags(pl,tag) {
    if (!HaveTag(pl,tag)){
		return 0;
	}
    var numAnswers = 0;
    var tempText = "";
    if (!HaveTag(pl,tag)) {
    	return 0;
    }
    tempText = pl;
    while (tempText.indexOf(tag)!=-1) {
    	tempText = tempText.substring(
    	tempText.indexOf(tag)+tag.length,tempText.length);
        numAnswers++;
    }
    return numAnswers;
}

//retorna um vetor com o endereço de todos os "tags" encontrados
function whereAllTag(pl,tag) {
	if (pl.indexOf(tag)==-1){
		return -1;
	}
    var address = [];
    var tempText = pl;
    var lastAndress = -1;
	  // var retorno = [];
    while (tempText.indexOf(tag)!=-1) {
    	 var addressTemp = tempText.indexOf(tag)+lastAndress+1
       lastAndress = addressTemp+tag.length-1;
		tempText = tempText.substring( tempText.indexOf(tag)+ tag.length, tempText.length);
        address.push(addressTemp);
    }
    return address;
}

//iguai whereAllTag porem se atentando no segundo parametrode Tags Somente uma linha.
function whereAllTags(pl,tagX) {
    if (isNaN(tagX[1])){
        return -1;
    }
    var tag = "";
    for (var i = 0; i < tagX[1] ; i++) {
        tag = tag.concat(tagX[0]);
    }
    return whereAllTag(pl,tag);
}

//RemoveAllInicialTag("11111234","1") => "234"
function RemoveAllInicialTag(pl,tag) {
    if (!HaveTag(pl,tag)){
		return pl;
	}
    var tempPl = pl;
    var andd = whereAllTag(pl,tag)
    for (var i = 0; i < HowManyTags(pl,tag) ; i++) {
    	if (andd[0]==0){
    		tempPl = tempPl.substring(tag.length,tempPl.length);
    	}
        andd = whereAllTag(tempPl,tag)
    }
    return tempPl;
}

//dado um texto, encontra o próximo comando dado o comando no formado to Tag
function NextCommndAnddres(pl,ComIni,ComEnd){
    var temp = whereAllTag(pl,ComIni);
	if (temp == -1){
    	return -1;
    }
    var respIni = temp[0];
    pl = pl.substring(respIni,pl.length);
    temp = whereAllTag(pl,ComEnd);
	if (temp == -1){
    	return -1;
    }
    var respEnd = temp[0] + respIni;
    var final = [respIni,respEnd];
    return final;
}

//RemoveAllInicialCommand("[com=12][com=1]texto",["com=","]"]) => "texto"
function RemoveAllInicialCommand(pl,ComIni,ComEnd) {
    var temp = whereAllTag(pl,ComIni)[0];
	if (temp == -1){
    	return pl;
    }
    var NextCommandIniAndEnd = NextCommndAnddres(pl,ComIni,ComEnd);
    if (NextCommandIniAndEnd == -1){
        return pl;
    }
    var TextiniToAll = pl;
    while (NextCommandIniAndEnd!=-1){
        NextCommandIniAndEnd = NextCommndAnddres(TextiniToAll,ComIni,ComEnd);
        if (NextCommandIniAndEnd[0]==0){
            TextiniToAll = TextiniToAll.substring(
                NextCommandIniAndEnd[1]+ComEnd.length
                , TextiniToAll.length);    
        } else {
            break;
        }
    }
    return TextiniToAll;
}

//ignoreExcessOfTag("123444445","4",2) => "123445"
function ignoreExcessOfTag(pl,tag,maxTimes) {
	if (maxTimes < 0){
		return pl;
	}
    if (!HaveTag(pl,tag)){
		return pl;
	}
    var textRes = pl;
    var substring="";
    var substringTag="";
    for (var i = 0; i < maxTimes+1; i++) {
    	substring += tag;
        if (i < maxTimes) {
        	substringTag +=tag;
        }
    }
    var numExcess = HowManyTags(textRes,substring);
    var textResIn  = textRes;
    var textResOut = "";
    while (true) {
        textResOut = replaceAll(textResIn, substring, substringTag);
        if (textResIn != textResOut) {
			textResIn  = textResOut;
        	textResOut = "";
        } else {
        	break;
        }
    }
    return textResOut;
}

//encontra os pontos em que deve haver quebra de balão,exige que o pl já tenha removido excessos
function findBreakSpeechBalloonTag(pl,tagz) {
    var PosTags = [];
    //var PosTagsFix = [];
    //monta array com todos valores encontrados
    for (var i = 0; i < tagz.length; i++) {
        var finded;
        if (!isNaN(tagz[i][1])){
            finded = whereAllTags(pl,tagz[i]);
        }else{
            finded = whereAllTag(pl,tagz[i][0]);
        }
        if (finded != -1){
            for (var k = 0; k < finded.length; k++) {
                PosTags.push(finded[k]);
            }
        }
    }
    PosTags = sort(PosTags);
    return PosTags;
}

//ordem crescente array 1xN
function sort(arraysuffle){
    arraysuffle.sort(function(a, b){return a - b});
    return arraysuffle;
}

//Encontra primeiro comando <\delay=x.x> e retorna o valor do delay
function SelectNumberDelayComand(command,tagz){
    var iniTagDelay=tagz[0][0];//"[\delay=";
    var endTagDelay=tagz[0][1];//">";
    var temp = whereAllTag(command,iniTagDelay);
	if (temp[0] == -1){
    	return -1;
	}
    var posIni = temp[0];
    var TextiniToAll = command.substring(command.indexOf(iniTagDelay)+ iniTagDelay.length, command.length);
    temp = whereAllTag(TextiniToAll,endTagDelay);
    if (temp[0] == -1){
    	return -1;
	}
    var posEnd = temp[0]+1+posIni+iniTagDelay.length;
    var varTemp = command.substring(posIni+iniTagDelay.length,posEnd-1)
    if (isNaN(varTemp)){
        return "NaN";
    } else {
        return Number(varTemp) ;	
    }
}

// CaptureSubArray([4,5,6,7,8,9],1,3) => [5,6,7]
function CaptureSubArray(arrayBig,i_ini,i_end){
    var len=i_end-i_ini;
    var arraySmall=[];
    for (var q = 0; q < len; q++){
        arraySmall.push(arrayBig[i_ini+q]);
    }
    return arraySmall;
}

//elege apenas um comando na prioridade do tags
function commandPriority(arrayToChooseOne,tagz){
    var resp = [];
    for (var p = 0; p < arrayToChooseOne.length; p++) {
        for (var y = tagz.length-1; y >= 0; y--) {
            if (HaveTag(arrayToChooseOne[p],tagz[y][0].substring(0,tagz[y][0].length-1))){
                resp.push(arrayToChooseOne[p]);
            }
        }
    }
    if (resp.length == 0){
        resp.push(-1);
    }
    return resp[0];
}

//conta um array só com os comandos que serão usados
function ToSelectCommmand(commands,tagz){
    var finalSize = commands.length / tagz.length;
    var resp = [];
    for (var s = 0; s < finalSize; s++) {
        var temArray = CaptureSubArray(commands,tagz.length*s,tagz.length*s+tagz.length);
        resp.push(commandPriority(temArray,tagz));
    } 
    return resp;
}

//cria dois arrays, os textos e os tempos
function TextBreakSpeechBalloonInArray(pl,tagz){
    for (var i = 0; i < tagz.length; i++) {
        if (isNaN(tagz[i][1])){
            pl = ignoreExcessOfTag(pl,tagz[i][0],2);
        } else {
            pl = ignoreExcessOfTag(pl,tagz[i][0],tagz[i][1]);
        }
        //teste - inicio
          pl = replaceAll(pl,"</div><div>","")
        //teste - fim

    }
    var response = [];
    var brakPoints = findBreakSpeechBalloonTag(pl,tagz);
    var TempIni=0;
    var TempEnd=brakPoints[0];
    for (var s = 0; s <= brakPoints.length; s++) {
        var TempText = pl.substring(TempIni,TempEnd);
        response.push(TempText);
		TempIni=brakPoints[s];
        TempEnd=brakPoints[s+1];
    }

    var commands = [];
    for (var l = 0; l < response.length; l++) {
    	for (var m = 0; m < tagz.length; m++) {
            var i_commands;
            if (!isNaN(tagz[m][1])){
                var tag = "";
                for (var i = 0; i < tagz[m][1] ; i++) {
                    tag = tag.concat(tagz[m][0]);
                }
                i_commands = NextCommndAnddres(response[l],tag,tag.substring(tag.length-1,tag.length));
            } else {
                i_commands = NextCommndAnddres(response[l],tagz[m][0],tagz[m][1]);
            }
            var firstsletters = response[l].substring(0,tagz[m][0].length);
            var isFirstCommand = false;
            if (firstsletters == tagz[m][0]){
                isFirstCommand = true;
            }
            if ((i_commands != -1)||(isFirstCommand)){
                commands.push( response[l].substring(i_commands[0],i_commands[1]+1) );
                if (!isNaN(tagz[m][1])){
                    response[l] = RemoveAllInicialTag(response[l],tagz[m][0]);
                } else {
                    if (tagz[m][1]==">"){
                        response[l] = RemoveAllInicialCommand(response[l],tagz[m][0],tagz[m][1]);
                    }
                }
            } else {
                commands.push(-1);
            }		
        }
    }
    commands = ToSelectCommmand(commands,tagz);
    commands = CommandToTime(response,commands,tagz);
    return [response,commands];
}

//transforma comando em valores
function CommandToTime(respIN,commIN,tagz){
    if (commIN == null){
        return [-1];
    }
    var resp=[];
    for (var m = 0; m < commIN.length; m++) {
        if (!isNaN(commIN[m])){ // is numeric?
            if( (commIN[m]==-1)){
                resp[m] = SpeedTextbyWords(respIN[m]);
            } else { //already have time.
                resp[m] = commIN[m];
            }
        } else { // is NaN
            if ( (commIN[m]!="NaN")){ // isn't this special case?
                //is Command
                var firstsletters = commIN[m].substring(0,tagz[0][0].length);
                var isDelay = false;
                if (firstsletters == tagz[0][0]){
                    isDelay = true;
                }
                if (isDelay){ // is </delay>?
                    resp[m] = SelectNumberDelayComand(commIN[m],tagz); // okey to "error return"
                } else { //isn't </delay>
                    var firstsletters = commIN[m].substring(0,tagz[1][0].length);
                    var isMultipleEnters = false;
                    if (firstsletters == tagz[1][0]){
                        isMultipleEnters = true;
                    }
                    if (isMultipleEnters){ // is multiple <br>?
                        resp[m] = SpeedTextbyWords(respIN[m]);
                    } else { // anything else
                        resp[m] = SpeedTextbyWords(respIN[m]);
                    }
                }
            }else{ // is "NaN"
                resp[m] = SpeedTextbyWords(respIN[m]);
            }
        }

    }
    var finalResp = resp;
    var recurcive = allElementsIsNumberAndWhere(resp);
    if (!recurcive[0]){
        var newResp = resp;
        newResp[recurcive[1]]=-1;
        finalResp = CommandToTime(respIN,newResp,tagz);
    }
    return finalResp;
}

//dado um array, verifica se todos os elementos são numericos, se não, onde está o não numerico
function allElementsIsNumberAndWhere(genericArray){
var isAlpha = false;
    for (var g = 0; g < genericArray.length; g++) {
        if (isNaN(genericArray[g])){
            isAlpha = true;
            break;
        }
    }
    if (!isAlpha){
        g=-1;
    }
return [!isAlpha,g];
}

//conta a quantidades de palavras de um texto (numero de espaços +1)
function CountWords(text){
    return HowManyTags(text.replace(/<(?:.|\n)*?>/gm, '')," ")+1;
}

//calcula o tempo que um texto demorará para ser lido
function SpeedTextbyWords(text){
return(60000*CountWords(text)/WordsPerMinute);
}

//transforma os tempos de cada texto em incremental ao londo do array
function FinalTimeModel(array) {//Creio ser o correto
    var resp=[];
    // array[0][1]=0;
    var time = 0;
	for (var i = 0; i < array.length; i++) {
    	resp.push(array[i]);
        time+=resp[i][1];
        resp[i][1]=time;  
  }
    return resp;
}

//quebra o texto em array com o tempo em que se deve ser reenderizado
function SpeechBalloons(pl,tagz){
    var resp = []
    var method = TextBreakSpeechBalloonInArray(pl,tagz);
    method[1].unshift(0);
    method[1].pop();
    // de   [[texto1,texto2,texto3],[tempo1,tempo2,tempo3]]
    // para [[texto1,tempo1],[texto2,tempo2],[texto3,tempo3]]
    for (var i = 0; i < method[0].length; i++) { 
        resp.push([method[0][i],method[1][i]]);
    }
    // de [[texto1,tempo1],[texto2,tempo2],[texto3,tempo3]]
    // para [[texto1,tempo1],[texto2,tempo1+tempo2],[texto3,tempo1+tempo2+tempo3]]
    resp=FinalTimeModel(resp);
    return resp;
}

//var teste = SpeechBalloons("t1<delay=1>t2<delay=xxx>t3<br><br>t4<delay=>t5<br><br><br>t6",tags);



};

// window.onload = (function() {
(function () {
  if (typeof jQuery == 'undefined') {
    var headTag = document.getElementsByTagName("head")[0];
    var jQueryTag = document.createElement('script');
    jQueryTag.type = 'text/javascript';
    jQueryTag.src = origin_url + '/node_modules/jquery/dist/jquery.js';
    jQueryTag.onload = chatLiveloJQueryCode;
    headTag.appendChild(jQueryTag);
  } else {
    chatLiveloJQueryCode();
  }
})();
