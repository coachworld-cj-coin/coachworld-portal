document.getElementById("loginBtn").addEventListener("click", function(){
  const pass = document.getElementById("adminPass").value.trim();
  
  // ADMIN PASSWORD (STATIC)
  const masterPass = "CJHouseVIP2025";

  if(pass === masterPass){
    localStorage.setItem("cj_admin_logged","1");
    window.location.href = "admin-panel.html";
  } else {
    const err = document.getElementById("errorBox");
    err.style.display = "block";
    setTimeout(()=>{err.style.display="none";},3000);
  }
});
