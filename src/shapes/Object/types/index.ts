import { FabricObjectProps } from './FabricObjectProps';

export type TProps<T> = Partial<T> & Record<string, any>;

export type TFabricObjectProps = TProps<FabricObjectProps>;
