// 2048 oyununu 4x4 bir matris olarak düşüneceğiz.
// yapılacak tüm işlemler matris elemanlarını toplamak olacak.

var board;
var skor = 0;
var satirlar = 4;
var sutunlar = 4;
var kaybettin = false;

//sayfa açıldığında çağırılacak fonksiyon
window.onload = function(){
    oyunBasla();
}

function oyunBasla() {
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]
    //oyun başladığında matris boş olacak

    for (let i = 0; i < satirlar; i++){
        for (let j = 0; j < sutunlar; j++){
        
            
            let tile = document.createElement("div");
            //div elemanı oluşturur
            tile.id = i.toString() + "-" + j.toString();
            //her matris elemanının idlerini konumlarına göre atar.

            let num = board[i][j];
            updateTile(tile,num);
            document.getElementById("board").append(tile);

        }
    }
    ikiEkle();
    ikiEkle();
}

function bosTileVar(){
    for (let i = 0 ; i < satirlar ; i++){
        for (let j = 0; j < sutunlar ; j ++){
            if(board[i][j] == 0){
                return true;
            }
        }
    }
    return false;
}

function ikiEkle() {

    if(!bosTileVar()){
        return;
    }

    let sayiVar = false;
    while(!sayiVar){

        //matrisi kontrol etmek için rastgele indisler
        let i = Math.floor(Math.random() * satirlar); 
        let j = Math.floor(Math.random() * sutunlar); 

        //boş ise 2 eklenecek.
        if (board[i][j] == 0){
            board[i][j] = 2;
            let tile = document.getElementById(i.toString() + "-" + j.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            sayiVar = true;
        }


    }
}

function updateTile(tile,num){
    tile.innerText = "";
    tile.classList.value = "";
    //tile içindeki yazıyı ve ait olduğu sınıfı temizler. 2,4,8... sayilari için ayrı ayrı sınıflar mevcut.

    tile.classList.add("tile");
    //hangi sayi oldugunu bulmak gerekiyor.
    if(num > 0){
        tile.innerText = num;
        if(num <= 4096){
            tile.classList.add("x"+num.toString());
            
        }
        else {
            tile.classList.add("x8192")
            //4096dan yukarıda olan sayıların renkleri unique olmadığından ayrıt etmeye gerek yok. Aynı sınıfta olabilirler
        }
    }
}

/* tuş kaldırıldığında çalışacak */
document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft"){
        solaKaydir();
        ikiEkle();
        // sol ok tuşuna basılmışsa çalışacak.
    }
    else if(e.code == "ArrowRight"){
        sagaKaydir();
        ikiEkle();
    }
    else if(e.code == "ArrowUp"){
        yukariKaydir();
        ikiEkle();
    }
    else if(e.code = "ArrowDown"){
        asagiKaydir();
        ikiEkle();
    }
    
    
    document.getElementById("skor").innerText = skor;

    //yapılan hamle sonucunda oyunun bitip bitmediği kontrol ediliyor.
    kayipKontrol();
    console.log(kaybettin);
    if(kaybettin){
        alert("Oyun bitti! Tekrar Oynamak İçin Lütfen Sayfayı Yenileyiniz.");
    }
    

    
})

/**
 * Toplama işlemi için yapılması gereken ilk işlem satırlardaki 0'ların temizlenmesi
 * 
 * Sonrasında hangi tuşa basılmışsa o yöndeki ilk elemanlar öncelikli olarak toplanıp ilgili satır veya sütunun güncellenmesi gerekli
 * 
 * Devamında 0'ların tekrar temizlenmesi gerekli çünkü örnek olarak:
 * [4,4,4,0] satırında sol oka basılırsa
 * önce [4,4,4] haline getirip
 * [8,0,4] yapılacaktır.
 * Sonrasında tekrar [8,4] yapılması gerekli.
 * 
 * Eksik elemanlar için ise 0 ile doldurulacak.
 */

function filterZeros(satir){
    return satir.filter(num => num != 0);
    //0lar temizleniyor.
}

function kaydir(satir) {

    satir = filterZeros(satir);  //[4,4,4,0] -> [4,4,4]


    //toplama işlemi: [4,4,4] -> [8,0,4]
    for(let i = 0 ; i <satir.length -1; i++){
        if(satir[i] == satir[i+1]){
            satir[i] *= 2;
            satir[i+1] = 0;
            skor += satir[i];
        }
    }

    satir = filterZeros(satir); //[8,0,4] -> [8,4]

    // [8,4] -> [8,4,0,0]
    while (satir.length < sutunlar){
        satir.push(0);
    }
    
    return satir;
}


function solaKaydir(){

    let boardKontrol = board;

    for(let i = 0; i < satirlar; i++ ){
        let satir = board[i];
        satir = kaydir(satir);
        board[i] = satir;


        //html güncellenecek
        for(let j = 0 ; j<sutunlar; j++){
            let tile = document.getElementById(i.toString() +"-"+ j.toString());
            let num = board[i][j];
            updateTile(tile,num);
        }
    }

    
}

/**
 * Sağa kaydırmak için satırı tersine çevirip sola kaydırıp tekrar satırı tersine çevirirsek sağa kaydırmış oluruz.
 * 
 * [4,4,4,2] -> [2,4,4,4]  tersine çevir
 * [2,4,4,4] -> [2,8,4,0]  sola kaydır
 * [2,8,4,0] -> [0,4,8,2]  tersine çevir
 */


function sagaKaydir(){

    for(let i = 0; i < satirlar; i++ ){
        let satir = board[i];
        satir.reverse();
        satir = kaydir(satir);
        satir.reverse();
        board[i] = satir;


        //html güncellenecek
        for(let j = 0 ; j<sutunlar; j++){
            let tile = document.getElementById(i.toString() +"-"+ j.toString());
            let num = board[i][j];
            updateTile(tile,num);
        }
    }
}


/**
 * Yukarı ve aşağı kaydırmak için ise matris satırının transpozu alınır.
 * Yani satir ve sütun indislerinin yerleri değiştirilir ve yukarıdaki sağa ve sola kaydirma işlemi tekrar edilir.
 */

function yukariKaydir(){
    for (let j = 0 ; j<sutunlar;j++){
        let satir = [board[0][j], board[1][j], board[2][j], board[3][j]];
        satir = kaydir(satir);

        //html güncellenecek
        for(let i = 0 ; i<satirlar; i++){
            board[i][j] = satir[i];
            let tile = document.getElementById(i.toString() +"-"+ j.toString());
            let num = board[i][j];
            updateTile(tile,num);
        }
    }
}

function asagiKaydir(){
    for (let j = 0 ; j<sutunlar;j++){
        let satir = [board[0][j], board[1][j], board[2][j], board[3][j]];
        satir.reverse();
        satir = kaydir(satir);
        satir.reverse();

        //html güncellenecek
        for(let i = 0 ; i<satirlar; i++){
            board[i][j] = satir[i];
            let tile = document.getElementById(i.toString() +"-"+ j.toString());
            let num = board[i][j];
            updateTile(tile,num);
        }
    }
}

/**
 * Oyun matris üzerinde yapılabilecek kaydırma işlemi olmadığında kaybedilecektir.
 * Bunun için her işlem yapıldıktan sonra matriste kontol yapılmalı.
 */

function kayipKontrol(){
    for (let i = 0 ; i<satirlar ; i++){
        for (let j = 0; j<sutunlar ; j++){

            //matriste boş tile mevcutsa oyun bitmemiştir.
            if(board[i][j] == 0){
                kaybettin = false;
                return;
            }
        
            //matriste ardışık aynı sayıdan bulunuyorsa hamle yapılabilir ve oyun bitmemiştir.
            if( (i<3 && board[i][j] == board[i+1][j]) ){
                kaybettin = false;
                return;
            }

            if((j<3 && board[i][j] == board[i][j+1] ) ){
                kaybettin = false;
                return;
            }
        

            else {
                kaybettin = true;
            }

        }
    }
}