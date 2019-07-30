
import {
    AppBar,
    Avatar,
    BottomSheet,
    Button,
    Card,
    Checkbox,
    Chip,
    Dialog,
    Divider,
    Drawer,
    ExpansionPanel,
    Form,
    Grid,
    Icon,
    List,
    Menu,
    Paper,
    Radio,
    Select,
    Slider,
    Snackbar,
    Stepper,
    Switch,
    TextField,
    // Alert,
    // AutoComplete,
    // Badge,
    // BottomNav,
    // Breadcrumbs,
    // DateInput,
    // DataTable,
    // GridList,
    // Helpers,
    // LoadMore,
    // Pagination,
    // Picker,
    // Popover,
    // Progress,
    // SlidePicker,
    // SubHeader,
    // Tabs,
    // Tooltip,
    // theme
} from 'muse-ui';

import {
    MdButton,
    MdContent,
    MdTabs,
    MdCard,
    MdIcon,
    MdField
} from 'vue-material/dist/components'

import VueCarousel from 'vue-carousel'
import VueMasonry from 'vue-masonry-css'

import globalComponents from "./globalComponents";
//import globalDirectives from "./globalDirectives";
import globalMixins from "./globalMixins";

export default {
    install(Vue) {
        //------ Muse-ui
        Vue.use(AppBar);
        Vue.use(Menu);
        Vue.use(Button);
        Vue.use(List);
        Vue.use(Icon);
        Vue.use(Divider);
        Vue.use(Form);
        Vue.use(Radio);
        Vue.use(TextField);
        Vue.use(Grid);
        Vue.use(Checkbox);
        Vue.use(Drawer);
        Vue.use(Slider);
        Vue.use(Select);
        Vue.use(Card);
        Vue.use(ExpansionPanel);
        Vue.use(Paper);
        Vue.use(Avatar);
        Vue.use(Switch);
        Vue.use(Stepper);
        Vue.use(BottomSheet);
        Vue.use(Dialog);
        Vue.use(Chip);
        Vue.use(Snackbar);

        //------ Vue-Material
        Vue.use(MdButton);
        Vue.use(MdContent);
        Vue.use(MdTabs);
        Vue.use(MdCard);
        Vue.use(MdIcon);
        Vue.use(MdField);

        //------ Plugins
        //Vue.use(globalDirectives);
        Vue.use(globalMixins);
        Vue.use(globalComponents);
    }
};
