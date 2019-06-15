function check_before_fun(str, fun, i){
    // [a-zA-Z\d] expresion regular 
    let re = /[a-zA-Z\d]/;
    if(i >= 0){
        if(i-1<0 || !re.test(str[i-1])){
            return true;
        }
    }
    return false;
}

function math_lib_check(e){
    let check;
    let functions_toCheck = ["abs","acos","cos","asin","sin","atan","tan","cbrt","exp","log","log1p","log10","log2","max","min","pow","random","round","sqrt","trunc"];

    for(let i in functions_toCheck){
        let func = functions_toCheck[i] + '(';
        check = e.indexOf(func);
        if(check_before_fun(e,func,check)){
            let repl = 'Math.' + func;
            e = e.replace(func,repl);
        }
    }

    return e;
}
