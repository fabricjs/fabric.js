import type { FabricObjectProps } from './FabricObjectProps';

export type { SerializedObjectProps } from './SerializedObjectProps';
export type { FabricObjectProps };

export type TProps<T> = Partial<T> & Record<string, any>;

export type TFabricObjectProps = TProps<FabricObjectProps>;
