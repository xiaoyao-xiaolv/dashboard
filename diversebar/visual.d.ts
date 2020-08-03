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
    name: string;
    display: string;
    format: string;
    method: string;
    dataType: string;
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
  interface ITootipPosition {
    x: number;
    y: number;
  }
  interface ILabelFields {
    label: string;
    value: string;
  }
  interface ITooltipConfig {
    position: ITootipPosition;
    title?: string;
    fields?: ILabelFields[];
    selectionId?: any;
    selected?: [];
    menu?: boolean;
  }
  type VisualUpdateType = 'dataViewChange' | 'propertyChange' | 'environmentChange' | 'scaleChange' | 'fullyChange';
  type Language = 'en-US' | 'zh-CN' | 'zh-TW';
  interface ICommandDescription {
    name: string;
    payload: {
      target: string;
    };
  }
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
  }

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

  class FormatService {
    format(format: string, value: number): string;
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
    clear(id?: SelectionId): Promise<void>;
    registerOnSelectCallback(onSelectCallback: (ids: SelectionId[]) => void);
    contains(id: SelectionId): boolean;
    isEmpty(): boolean;
  }

  class SelectionService {
    createSelectionManager(): SelectionManager;
    createSelectionId(src?: SelectionId): SelectionId;
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
  }
}

declare class WynVisual {
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, updateOptions: VisualNS.IVisualUpdateOptions);
  update(options: VisualNS.IVisualUpdateOptions): void;
  getInspectorHiddenState(updateOptions: VisualNS.IVisualUpdateOptions): string[];
  getActionBarHiddenState(updateOptions: VisualNS.IVisualUpdateOptions): string[];
  onResize(): void;
  onDestroy(): void;
}