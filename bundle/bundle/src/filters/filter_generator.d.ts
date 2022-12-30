export declare function createColorMatrixFilter(key: string, matrix: number[]): {
    new (options?: Partial<import("./base_filter.class").AbstractBaseFilterOptions<string>>): {
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    };
    fromObject(object: any): Promise<{
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    }>;
};
export declare const Brownie: {
    new (options?: Partial<import("./base_filter.class").AbstractBaseFilterOptions<string>>): {
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    };
    fromObject(object: any): Promise<{
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    }>;
};
export declare const Vintage: {
    new (options?: Partial<import("./base_filter.class").AbstractBaseFilterOptions<string>>): {
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    };
    fromObject(object: any): Promise<{
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    }>;
};
export declare const Kodachrome: {
    new (options?: Partial<import("./base_filter.class").AbstractBaseFilterOptions<string>>): {
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    };
    fromObject(object: any): Promise<{
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    }>;
};
export declare const Technicolor: {
    new (options?: Partial<import("./base_filter.class").AbstractBaseFilterOptions<string>>): {
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    };
    fromObject(object: any): Promise<{
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    }>;
};
export declare const Polaroid: {
    new (options?: Partial<import("./base_filter.class").AbstractBaseFilterOptions<string>>): {
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    };
    fromObject(object: any): Promise<{
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    }>;
};
export declare const Sepia: {
    new (options?: Partial<import("./base_filter.class").AbstractBaseFilterOptions<string>>): {
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    };
    fromObject(object: any): Promise<{
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    }>;
};
export declare const BlackWhite: {
    new (options?: Partial<import("./base_filter.class").AbstractBaseFilterOptions<string>>): {
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    };
    fromObject(object: any): Promise<{
        /**
         * Filter type
         * @param {String} type
         * @default
         */
        type: string;
        /**
         * Colormatrix for the effect
         * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
         * outside the -1, 1 range.
         * @param {Array} matrix array of 20 numbers.
         * @default
         */
        matrix: number[];
        /**
         * Lock the matrix export for this kind of static, parameter less filters.
         */
        mainParameter: undefined;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        colorsOnly: boolean;
        setOptions({ matrix, ...options }: Record<string, any>): void;
        applyTo2d(options: import("./typedefs").T2DPipelineState): void;
        getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLUniformLocationMap;
        sendUniformData(gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap): void;
        getFragmentSource(): string;
        /**
         * Lock the colormatrix on the color part, skipping alpha
         */
        vertexSource: string;
        fragmentSource: string;
        createProgram(gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string): {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        };
        getAttributeLocations(gl: WebGLRenderingContext, program: WebGLProgram): import("./typedefs").TWebGLAttributeLocationMap;
        sendAttributeData(gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array): void;
        _setupFrameBuffer(options: import("./typedefs").TWebGLPipelineState): void;
        _swapTextures(options: import("./typedefs").TWebGLPipelineState): void;
        isNeutralState(options?: any): boolean;
        applyTo(options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState): void;
        getCacheKey(): string;
        retrieveShader(options: import("./typedefs").TWebGLPipelineState): import("./typedefs").TWebGLProgramCacheItem;
        applyToWebGL(options: import("./typedefs").TWebGLPipelineState): void;
        bindAdditionalTexture(gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number): void;
        unbindAdditionalTexture(gl: WebGLRenderingContext, textureUnit: number): void;
        getMainParameter(): string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | (() => string | boolean | number[] | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLAttributeLocationMap) | ((options: import("./typedefs").TWebGLPipelineState) => import("./typedefs").TWebGLProgramCacheItem) | ((options?: any) => boolean) | ((gl: WebGLRenderingContext, program: WebGLProgram) => import("./typedefs").TWebGLUniformLocationMap) | (({ matrix, ...options }: Record<string, any>) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | ((gl: WebGLRenderingContext, uniformLocations: import("./typedefs").TWebGLUniformLocationMap) => void) | (() => string) | ((gl: WebGLRenderingContext, fragmentSource?: string, vertexSource?: string) => {
            program: WebGLProgram;
            attributeLocations: import("./typedefs").TWebGLAttributeLocationMap;
            uniformLocations: import("./typedefs").TWebGLUniformLocationMap;
        }) | ((gl: WebGLRenderingContext, attributeLocations: Record<string, number>, aPositionData: Float32Array) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((options: import("./typedefs").TWebGLPipelineState | import("./typedefs").T2DPipelineState) => void) | (() => string) | ((options: import("./typedefs").TWebGLPipelineState) => void) | ((gl: WebGLRenderingContext, texture: WebGLTexture, textureUnit: number) => void) | ((gl: WebGLRenderingContext, textureUnit: number) => void) | any | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined) | (() => {
            type: string;
        }) | (() => {
            type: string;
        }) | ((value: any) => void) | ((options: import("./typedefs").T2DPipelineState) => void) | undefined;
        setMainParameter(value: any): void;
        createHelpLayer(options: import("./typedefs").T2DPipelineState): void;
        toObject(): {
            type: string;
        };
        toJSON(): {
            type: string;
        };
    }>;
};
//# sourceMappingURL=filter_generator.d.ts.map