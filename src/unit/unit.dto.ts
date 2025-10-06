export class AddUnitDto {
    name: string;
    symbol: string;
    conversionFactor: number;
    parent: string;
}

export class UnitResponseDto {
    id: string;
    name: string
    symbol: string;
    conversionFactor: number;
    parent?: string;
    organizationId: string;
}