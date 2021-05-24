/* Do not add any code to this file. We are going to update this file on every release if necessary */

declare namespace VisualNS {
  interface IDocTheme {
    id: string;
    name: string;
    colors: {
      Dark1: string;
      Dark2: string;
      Light1: string;
      Light2: string;
      Accent1: string;
      Accent2: string;
      Accent3: string;
      Accent4: string;
      Accent5: string;
      Accent6: string;
      Hyperlink: string;
      HyperlinkFollowed: string;
    };
    textStyle: {
      majorFontSize: string;
      minorFontSize: string;
      majorFontStyle: string;
      minorFontStyle: string;
      majorFontFamily: string;
      minorFontFamily: string;
      majorFontWeight: string;
      minorFontWeight: string;
    };
  }
  interface IFieldProfile {
    id: any;
    name: string;
    display: string;
    format: string;
    method: string;
    dataType: string;
    options: {
      [name: string]: any;
    }
  }
  interface IDataPoint {
    [datasetColumnDisplay: string]: string | number;
  }
  interface IDataViewProfiles {
    [dataRoleName: string]: {
      options: any,
      values: IFieldProfile[],
    },
  }
  interface ISingleDataView {
    value: number;
    profile: IDataViewProfiles;
    options: any;
  }
  interface IPlainDataView {
    data: IDataPoint[];
    profile: IDataViewProfiles;
    sort: {
      [dataRoleName: string]: {
        order: any[],
        priority: -1 | 0 | 1, // default | user-set | override
      }
    };
    options: any;
  }
  interface IHierarchyHeader {
    type?: 'grouping' | 'value';
    column: string;
    label?: string | number;
    next?: IHierarchyHeader[];
  }
  interface IHierarchyInfo {
    levels: string[],
    headers: IHierarchyHeader[],
    sortPriority: number,
  }
  interface IMatrixDataView {
    matrix: {
      rows: IHierarchyInfo;
      columns: IHierarchyInfo;
      values: IDataPoint[];
    };
    profile: IDataViewProfiles;
    options: any;
  }
  interface IDataView {
    matrix: IMatrixDataView;
    plain: IPlainDataView;
    single: ISingleDataView;
  }
  interface IPosition {
    x: number;
    y: number;
  }
  type ITootipPosition = IPosition;
  interface ILabelFields {
    label: string;
    value: string;
  }
  interface ITooltipConfig {
    position: ITootipPosition;
    title?: string;
    fields?: ILabelFields[];
    selectionId?: SelectionId;
    selected?: SelectionId[];
    menu?: boolean;
  }
  interface IContextMenuConfig {
    position: IPosition;
  }
  type Language = 'en-US' | 'zh-CN' | 'zh-TW';
  enum VisualUpdateType {
    DataViewChange = 'dataViewChange',
    PropertyChange = 'propertyChange',
    EnvironmentChange = 'environmentChange',
    ScaleChange = 'scaleChange',
    FilterChange = 'filterChange',
    FullyChange = 'fullyChange',
    ViewportChange = 'viewportChange',
  }
  interface ICommandDescription {
    name: string;
    payload: {
      [key: string]: any;
    };
  }
  interface ISwitchPageCommand extends ICommandDescription {
    name: 'SwitchPage';
    payload: {
      index?: number;
      name?: string;
    };
  }
  interface ISwitchTabCommand extends ICommandDescription {
    name: 'SwitchTab';
    payload: {
      target: string;
      index?: number;
      name?: string;
    };
  }
  interface IInteractionCommand extends ICommandDescription {
    name: 'Keep' | 'Exclude' | 'Drill' | 'Jump';
    payload: {
      selectionIds?: SelectionId[] | SelectionId;
      position?: IPosition;
    }
  }
  type IFilter = IBasicFilter | IAdvancedFilter | ITupleFilter;
  interface IVisualUpdateOptions {
    isViewer: boolean;
    isMobile: boolean;
    isEditing: boolean;
    isFocus: boolean;
    dataViews: IDataView[];
    updateType: VisualUpdateType;
    properties: any;
    docTheme: IDocTheme;
    language: Language;
    scale: number;
    filters: IFilter[];
    viewport: {
      width: number;
      height: number;
      scale: number;
    };
  }

  interface IDimensionColorAssignmentConfig {
    values: any[];
    type: 'dimension';
    columns: IFieldProfile[];
  }
  interface IMeasureColorAssignmentConfig {
    type: 'measure';
    columns: IFieldProfile[];
  }
  export type IColorAssignmentConfigMapping = {
    [name: string]: IDimensionColorAssignmentConfig | IMeasureColorAssignmentConfig,
  };

  class EventService {
    renderStart(): void;
    renderError(): void;
    renderFinish(): void;
    registerOnCustomEventCallback(fn: (name: string) => void);
  }

  class LocalizationManager {
    getDisplay(displayNameKey: string): string;
  }

  class ToolTipService {
    show(config: ITooltipConfig): void;
    hide(): void;
    move(pos: ITootipPosition): void;
  }

  class PropertyService {
    setProperty(propertyName: string, value: any): void;
  }

  enum DisplayUnit {
    Auto = 'auto',
    None = 'none',
    Hundreds = 'hundreds',
    Thousands = 'thousands',
    TenThousand = 'tenThousands',
    HundredThousand = 'hundredThousand',
    Millions = 'millions',
    TenMillion = 'tenMillion',
    HundredMillion = 'hundredMillion',
    Billions = 'billions',
    Trillions = 'trillions',
  }

  enum InteractionAction {
    ShowTooltip = 'showTooltip',
    None = 'none',
    Keep = 'keep',
    Exclude = 'exclude',
    DrillTo = 'drillTo',
    JumpTo = 'jumpTo',
  }

  class FormatService {
    isAutoDisplayUnit(displayUnit: DisplayUnit): boolean;
    getAutoDisplayUnit(values: number[]): DisplayUnit;
    format(format: string, value: number, displayUnit?: DisplayUnit): string;
  }

  class SelectionId {
    withMeasure(profile: IFieldProfile): SelectionId;
    withDimension(profile: IFieldProfile, dataPoint: IDataPoint): SelectionId;
    equals(target: SelectionId): boolean;
    includes(target: SelectionId): boolean;
  }

  class SelectionManager {
    setSelectionIds(ids: Array<SelectionId>): void;
    getSelectionIds(): Array<SelectionId>;
    getCount(): number;
    select(id: SelectionId | Array<SelectionId>, multiSelect: boolean): Promise<void>;
    clear(id?: SelectionId | Array<SelectionId>): Promise<void>;
    registerOnSelectCallback(onSelectCallback: (ids: SelectionId[]) => void);
    contains(id: SelectionId): boolean;
    isEmpty(): boolean;
  }

  class SelectionService {
    createSelectionManager(): SelectionManager;
    createSelectionId(src?: SelectionId): SelectionId;
  }

  class ContextMenuService {
    show(config: IContextMenuConfig): void;
    hide(): void;
  }

  class AssetsManager {
    getImage(imageName: string): string;
  }

  class ConfigurationManager {
    get(key: string): string;
  }

  class CommandService {
    execute(desc: Array<ICommandDescription>): void;
  }

  abstract class FilterBase {
    public abstract toJSON(): Object;
  
    public abstract fromJSON(obj): void;
  
    public abstract isEmpty(): boolean;
  }

  class FilterService {
    applyFilter(filter: FilterBase);
    clean();
  }

  class VisualHost {
    public eventService: EventService;
    public localizationManager: LocalizationManager;
    public toolTipService: ToolTipService;
    public propertyService: PropertyService;
    public formatService: FormatService;
    public selectionService: SelectionService;
    public assetsManager: AssetsManager;
    public configurationManager: ConfigurationManager;
    public commandService: CommandService;
    public filterService: FilterService;
    public contextMenuService: ContextMenuService;
  }

  interface IFilterTarget {
    column: string;
  }
  enum VisualFilterType {
    Basic = 'basic',
    Advanced = 'advanced',
    Tuple = 'tuple',
  }
  interface IFilterBase {
    target: IFilterTarget;
    filterType: VisualFilterType;
  }

  enum BasicFilterOperator {
    In = 'In',
    NotIn = 'NotIn',
  }
  interface IBasicFilter extends IFilterBase {
    operator: BasicFilterOperator;
    values: any[];
  }

  enum AdvancedFilterOperator {
    LessThan = 'LessThan',
    LessThanOrEqual = 'LessThanOrEqual',
    GreaterThan = 'GreaterThan',
    GreaterThanOrEqual = 'GreaterThanOrEqual',
  }
  interface IAdvancedFilterCondition {
    value: any;
    operator: AdvancedFilterOperator;
  }
  enum AdvancedFilterLogicalOperator {
    And = 'And',
    Or = 'Or',
  }
  interface IAdvancedFilter extends IFilterBase {
    conditions: IAdvancedFilterCondition[];
    logicalOperator: AdvancedFilterLogicalOperator;
  }

  type ITuple = { value: any }[];
  interface ITupleFilter {
    target: IFilterTarget[];
    filterType: 'tuple';
    operator: BasicFilterOperator;
    values: ITuple[];
  }

  class BasicFilter extends FilterBase {
    constructor(targetProfile: IFieldProfile, operator?: BasicFilterOperator, values?: any[]);

    setOperator(operator: BasicFilterOperator);
    getOperator(): BasicFilterOperator;
    getValues(): any[];
    setValues(vals: any[]);
    toJSON(): IBasicFilter;
    fromJSON(obj: IBasicFilter);
    contains(value: any): boolean;
    remove(val: any);
    add(val: any);
    isEmpty(): boolean;
  }

  class AdvancedFilter extends FilterBase {
    constructor(targetProfile: IFieldProfile, logicalOperator?: AdvancedFilterLogicalOperator, conditions?: IAdvancedFilterCondition[]);
  
    setLogicalOperator(operator: AdvancedFilterLogicalOperator);
    getLogicalOperator(): AdvancedFilterLogicalOperator;
    setConditions(conditions: IAdvancedFilterCondition[]);
    getConditions(): IAdvancedFilterCondition[];
    toJSON(): IAdvancedFilter;
    fromJSON(obj: IAdvancedFilter);
    remove(condtion: IAdvancedFilterCondition);
    add(condtion: IAdvancedFilterCondition);
    isEmpty(): boolean;
  }

  class TupleFilter extends FilterBase {
    constructor(targetProfiles: IFieldProfile[], operator?: BasicFilterOperator, values?: ITuple[]);

    setOperator(operator: BasicFilterOperator);
    getOperator(): BasicFilterOperator;
    getValues(): ITuple[];
    setValues(vals: ITuple[]);
    toJSON(): ITupleFilter;
    fromJSON(obj: ITupleFilter);
    contains(tuple: ITuple): boolean;
    remove(tuple: ITuple);
    add(tuple: ITuple);
    createTuple(dp: IDataPoint, depth?: number): ITuple;
    isEmpty(): boolean;
  }

  interface WynVisualModels {
    Filter: {
      BasicFilter: typeof VisualNS.BasicFilter,
      AdvancedFilter: typeof VisualNS.AdvancedFilter,
      TupleFilter: typeof VisualNS.TupleFilter,
    },
  }
  interface WynVisualEnums {
    FilterType: typeof VisualFilterType,
    BasicFilterOperator: typeof BasicFilterOperator,
    AdvancedFilterOperator: typeof AdvancedFilterOperator,
    AdvancedFilterLogicalOperator: typeof AdvancedFilterLogicalOperator,
    UpdateType: typeof VisualUpdateType,
    DisplayUnit: typeof DisplayUnit,
    InteractionAction: typeof InteractionAction,
  }
}

declare class WynVisual {
  static Models: VisualNS.WynVisualModels;
  static Enums: VisualNS.WynVisualEnums;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, updateOptions: VisualNS.IVisualUpdateOptions);
  update(options: VisualNS.IVisualUpdateOptions): void;
  getInspectorHiddenState(updateOptions: VisualNS.IVisualUpdateOptions): string[];
  getActionBarHiddenState(updateOptions: VisualNS.IVisualUpdateOptions): string[];
  getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping;
  onDestroy(): void;
}