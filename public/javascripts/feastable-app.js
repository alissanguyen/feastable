import "../sass/style.scss";

import { $, $$ } from "./modules/bling"; //document.QuerySelector

import autocomplete from "./modules/autocomplete";

import typeAhead from "./modules/typeAhead";

autocomplete($("#address"), $("#lat"), $("#lng"));

typeAhead($("search"));
