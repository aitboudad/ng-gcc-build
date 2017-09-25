import { ModuleWithProviders, Provider } from "@angular/core";
export * from "./translate.loader";
export * from "./translate.service";
export * from "./missing-translation-handler";
export * from "./translate.parser";
export * from "./translate.compiler";
export * from "./translate.pipe";
export interface TranslateModuleConfig {
    loader?: Provider;
    compiler?: Provider;
    parser?: Provider;
    missingTranslationHandler?: Provider;
    isolate?: boolean;
    useDefaultLang?: boolean;
}
export declare class TranslateModule {
    /**
     * Use this method in your root module to provide the TranslateService
     * @param {TranslateModuleConfig} config
     * @returns {ModuleWithProviders}
     */
    static forRoot(config?: TranslateModuleConfig): ModuleWithProviders;
    /**
     * Use this method in your other (non root) modules to import the directive/pipe
     * @param {TranslateModuleConfig} config
     * @returns {ModuleWithProviders}
     */
    static forChild(config?: TranslateModuleConfig): ModuleWithProviders;
}
