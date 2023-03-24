import { FabricObjectProps } from './FabricObjectProps';

export { SerializedObjectProps } from './SerializedObjectProps';
export { FabricObjectProps };

export type TProps<T> = Partial<T> & Record<string, any>;

export type TFabricObjectProps = TProps<FabricObjectProps>;
