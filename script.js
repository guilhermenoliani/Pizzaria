//Carrinho
let cart = [];

//Quantidade do modal
let modalQt = 1;

//key das pizzas
let pizzaKey = 0;

//Atalho para não precisar ficar escrevendo 'document.querySelector'
const qS = (el) => document.querySelector(el);
const qSAll = (el) => document.querySelectorAll(el);

//Para ele mapear o JSON
pizzaJson.map((item, index) => {
  let pizzaItem = qS(".models .pizza-item").cloneNode(true); // Função para clonar do html não só o próprio item, mas tudo que estiver dentro dele.

  pizzaItem.setAttribute("data-key", index); //Adicionando em pizzaItem, qual é a chave daquele item específico

  //preencher as informações em pizza-item
  pizzaItem.querySelector(".pizza-item--img img").src = item.img; // Inserindo a imagem dos itens

  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`; // Adicionando o preço das pizzas com template string e com o .toFixed(2) estou formatando o preço

  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name; // Adicionando o nome das pizzas
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description; // Adicionando descrição ás pizzas

  // Adicionando evento de click para abrir o modal
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault(); //Prevenindo ação padrão de atualizar a página

    let key = e.target.closest(".pizza-item").getAttribute("data-key"); // Pegando o atributo data-key de cada item

    modalQt = 1; //Zerando a quantidade do modal sempre que abra o modal

    pizzaKey = key; // Pegando o data-key de cada pizza para colocar no adicionar o carrinho

    //ADICIONANDO AS INFORMAÇÕES DAS PIZZAS NO MODAL
    qS(".pizzaBig img").src = pizzaJson[key].img; // Adicionando a imagem no MODAL
    qS(".pizzaInfo h1").innerHTML = pizzaJson[key].name; //Preenchendo o nome da pizza no MODAL
    qS(".pizzaInfo--desc").innerHTML = pizzaJson[key].description; //Preenchendo a descrição da pizza no MODAL
    qS(".pizzaInfo--size.selected").classList.remove("selected"); //Removendo o item selecionado  dos tamanhos
    /////////////////////////////////////////////////////

    // Preenchendo informações de tamanhos
    qSAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
      //Toda vez que abrir o modal, ele abre na pizza grande
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex]; // Adicionando os tamanhos
    });
    ///////////////////////////////////////

    qS(".pizzaInfo--qt").innerHTML = modalQt; // Adicionando o valor padrão ao modal

    //Preenchendo preço da pizza
    qS(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[
      key
    ].price.toFixed(2)}`;
    //////////////////////////////

    qS(".pizzaWindowArea").style.opacity = 0; // Adicionando opacidade 0, para fazer efeito de abertura no modal
    qS(".pizzaWindowArea").style.display = "flex"; //Abrindo o modal na tela
    setTimeout(() => {
      // Adicionando função para que depois de 2 milissegundos ele abra o modal com efeito
      qS(".pizzaWindowArea").style.opacity = 1;
    }, 100);
  });

  //Adicionar na tela
  qS(".pizza-area").append(pizzaItem);
});

//Ações do modal

//Função para fechar o modal
const closeModal = () => {
  qS(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    qS(".pizzaWindowArea").style.display = "none";
  }, 200);
};

//Criando ação de click para fechar o modal
qSAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

//Botão adicionar e diminuir produtos do carrinho
qS(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
  }
  qS(".pizzaInfo--qt").innerHTML = modalQt;
});
qS(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  qS(".pizzaInfo--qt").innerHTML = modalQt;
});

qSAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", () => {
    qS(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});
////////////////////////////

//Adicionando dados ao carrinho
qS(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt(qS(".pizzaInfo--size.selected").getAttribute("data-key"));

  let identifier = pizzaJson[pizzaKey].id + "$$" + size; // Identificador da pizza

  let identKey = cart.findIndex((item) => item.identifier == identifier); // Verificação de item no carrinho

  if (identKey > -1) {
    cart[identKey].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[pizzaKey].id,
      size,
      qt: modalQt,
    });
  }
  updateCart();
  closeModal();
});

// Função para abrir o carrinho
qS(".menu-openner").addEventListener("click", () => {
  //Se tiver algum item no carrinho, abrir o mesmo
  if (cart.length > 0) {
    qS("aside").style.left = "0vw";
  } else {
  }

  qS(".menu-closer").addEventListener("click", () => {
    qS("aside").style.left = "100vw";
  });
});

//Função para atualizar o carrinho
const updateCart = () => {
  qS(".menu-openner span").innerHTML = cart.length; // Adicionando valor do carrinho ao carrinho mobile

  if (cart.length > 0) {
    qS("aside").classList.add("show"); // Abrir carrinho se tiver algum item
    qS(".cart").innerHTML = ""; // Zerando o carrinho

    //Armazenando valores do carrinho[1]
    let subTotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id); //Itens selecionados
      let cartItem = qS(".models .cart--item").cloneNode(true); // Clonando o cart-item

      //Calculando o subTotal[1]
      subTotal = pizzaItem.price * cart[i].qt;

      //Variável para adicionar os tamanhos ao lado do nome
      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;
        case 1:
          pizzaSizeName = "M";
          break;
        case 2:
          pizzaSizeName = "G";
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector(".cart--item img").src = pizzaItem.img; // Adicionando imagem da pizza no carrinho
      cartItem.querySelector(".cart--item .cart--item-nome").innerHTML =
        pizzaName; // preenchendo nome e tamanho no carrinho
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt; // Adicionando a quantidade de pizza conforme o usuário pediu

      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });

      qS(".cart").append(cartItem); //Aparecendo o cart-item na tela
    }

    desconto = subTotal * 0.1;
    total = subTotal - desconto;

    qS(".subtotal span:last-child").innerHTML = `R$ ${subTotal.toFixed(2)}`; //Adicionando o valor do subTotal
    qS(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`; // Adicionando o valor do desconto
    qS(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`; // Adicionando o valor do total
  } else {
    qS("aside").classList.remove("show"); // Fechar o carrinho se não tiver item
    qS("aside").style.left = "100vw"; // Fechar carrinho mobile se não tiver items
  }
};
