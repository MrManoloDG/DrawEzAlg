function math_lib_check(e){
    let check;


    check = e.indexOf("abs(");
    if(check >= 0){
        e = e.replace("abs(","Math.abs(");
    }

    check = e.indexOf("acos(");
    if(check >= 0){
        e = e.replace("acos(","Math.acos(");
    }else{
        check = e.indexOf("cos(");
        if(check >= 0){
            e = e.replace("cos(", "Math.cos(");
        }
    }

    check = e.indexOf("asin(");
    if(check >= 0){
        e = e.replace("asin(","Math.asin(");
    }else{
        check = e.indexOf("sin(");
        if(check >= 0){
            e = e.replace("sin(", "Math.sin(");
        }
    }

    check = e.indexOf("atan(");
    if(check >= 0){
        e = e.replace("atan(","Math.atan(");
    }else{
        check = e.indexOf("tan(");
        if(check >= 0){
            e = e.replace("tan(", "Math.tan(");
        }
    }

    check = e.indexOf("cbrt(");
    if(check >= 0){
        e = e.replace("cbrt(","Math.cbrt(");
    }

    check = e.indexOf("exp(");
    if(check >= 0){
        e = e.replace("exp(","Math.exp(");
    }

    check = e.indexOf("log(");
    if(check >= 0){
        e = e.replace("log(","Math.log(");
    }

    check = e.indexOf("log1p(");
    if(check >= 0){
        e = e.replace("log1p(","Math.log1p(");
    }

    check = e.indexOf("log10(");
    if(check >= 0){
        e = e.replace("log10(","Math.log10(");
    }

    check = e.indexOf("log2(");
    if(check >= 0){
        e = e.replace("log2(","Math.log2(");
    }

    check = e.indexOf("max(");
    if(check >= 0){
        e = e.replace("max(","Math.max(");
    }

    check = e.indexOf("min(");
    if(check >= 0){
        e = e.replace("min(","Math.min(");
    }

    check = e.indexOf("pow(");
    if(check >= 0){
        e = e.replace("pow(","Math.pow(");
    }

    check = e.indexOf("random(");
    if(check >= 0){
        e = e.replace("random(","Math.random(");
    }

    check = e.indexOf("round(");
    if(check >= 0){
        e = e.replace("round(","Math.round(");
    }

    check = e.indexOf("Math.sqrt(");
    if(check >= 0){
        e = e.replace("sqrt(","Math.sqrt(");
    }

    check = e.indexOf("trunc(");
    if(check >= 0){
        e = e.replace("trunc(","Math.trunc(");
    }

    return e;
}
