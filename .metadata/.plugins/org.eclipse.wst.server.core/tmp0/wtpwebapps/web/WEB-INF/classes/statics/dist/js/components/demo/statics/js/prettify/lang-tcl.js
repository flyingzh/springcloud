"use strict";PR.registerLangHandler(PR.createSimpleLexer([["opn",/^\{+/,null,"{"],["clo",/^\}+/,null,"}"],["com",/^#[^\r\n]*/,null,"#"],["pln",/^[\t\n\r \xA0]+/,null,"\t\n\r  "],["str",/^\"(?:[^\"\\]|\\[\s\S])*(?:\"|$)/,null,'"']],[["kwd",/^(?:after|append|apply|array|break|case|catch|continue|error|eval|exec|exit|expr|for|foreach|if|incr|info|proc|return|set|switch|trace|uplevel|upvar|while)\b/,null],["lit",/^[+\-]?(?:[0#]x[0-9a-f]+|\d+\/\d+|(?:\.\d+|\d+(?:\.\d*)?)(?:[ed][+\-]?\d+)?)/i],["lit",/^\'(?:-*(?:\w|\\[\x21-\x7e])(?:[\w-]*|\\[\x21-\x7e])[=!?]?)?/],["pln",/^-*(?:[a-z_]|\\[\x21-\x7e])(?:[\w-]*|\\[\x21-\x7e])[=!?]?/i],["pun",/^[^\w\t\n\r \xA0()\"\\\';]+/]]),["tcl"]);