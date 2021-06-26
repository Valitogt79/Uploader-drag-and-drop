const d = document,
  $main = d.querySelector("main"),
  $dropZone = d.querySelector(".drop-zone");

//* Funcion para la carga de los archivos.
const uploader = (file) => {
  const xhr = new XMLHttpRequest(),
    formData = new FormData();

  formData.append("file", file);

  //* Creando la petición
  xhr.addEventListener("readystatechange", (e) => {
    if (xhr.readyState !== 4) return;

    if (xhr.status >= 200 && xhr.status < 300) {
      let json = JSON.parse(xhr.responseText);
      console.log(json);
    } else {
      let message = xhr.statusText || "Ocurrió un Error";
      console.error(`${xhr.status}: ${message}`);
    }
  });
  xhr.open("POST", "assets/uploader.php");
  xhr.setRequestHeader("enc-type", "multipart/form-data");
  xhr.send(formData);
};

//* Barra de progreso a la carga de los archivos.
const progressUpload = (file) => {
  const $progress = d.createElement("progress"),
    $span = d.createElement("span");

  $progress.value = 0;
  $progress.max = 100;
  $main.insertAdjacentElement("beforeend", $progress);
  $main.insertAdjacentElement("beforeend", $span);

  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);

  fileReader.addEventListener("progress", (e) => {
    //console.log(e);
    let progress = parseInt((e.loaded * 100) / e.total);
    $progress.value = progress;
    $span.innerHTML = `<b>${file.name} - ${progress}%</b>`;
  });
  fileReader.addEventListener("loadend", (e) => {});
  uploader(file);
  setTimeout(() => {
    $main.removeChild($progress);
    $main.removeChild($span);
  }, 3000);
};

//* Agregando los elementos para realizar el over, el leave y el drop.

$dropZone.addEventListener("dragover", (e) => {
  //console.log(e);
  e.preventDefault();
  e.stopPropagation();
  e.target.classList.add("is-active");
});
$dropZone.addEventListener("dragleave", (e) => {
  //console.log(e);
  e.preventDefault();
  e.stopPropagation();
  e.target.classList.remove("is-active");
});
$dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();
  const files = Array.from(e.dataTransfer.files);
  files.forEach((el) => progressUpload(el));
  e.target.classList.remove("is-active");
});
