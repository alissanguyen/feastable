import "../sass/style.scss";

import { $, $$ } from "./modules/bling"; //document.QuerySelector

import autocomplete from "./modules/autocomplete";

autocomplete($("#address"), $("#lat"), $("#lng"));
