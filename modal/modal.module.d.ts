import { ModuleWithProviders } from '@angular/core';
export { NgbModalBackdrop } from './modal-backdrop';
export { NgbModal, NgbModalOptions } from './modal';
export { NgbModalRef, NgbActiveModal } from './modal-ref';
export { NgbModalStack } from './modal-stack';
export { ContentRef } from '../util/popup';
export { isDefined, isString } from '../util/util';
export { ModalDismissReasons } from './modal-dismiss-reasons';
export declare class NgbModalModule {
    static forRoot(): ModuleWithProviders;
}
