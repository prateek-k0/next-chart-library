export interface DataItemType {
  id: string,
  name: string,
  next: string[],
}

export interface TreeNode extends DataItemType {
  children: TreeNode[] | any[],
  _children: TreeNode[] | any[],
  collapsed: boolean,
}

export interface DataType {
  [prop: string]: DataItemType[]
}

export const data: DataType = {
  level0: [
    {
      id: '6420c09f-14de-44e9-894d-1b489943e445',
      name: 'Root',
      next: [
        'c470af25-3aad-4f68-919d-223a024b5915',
        'b1b0ab93-cc62-4174-9075-c55da94cd81b',
        '050ec079-60e5-4519-a3e1-f5dbed022f43',
      ]
    },
  ],
  level1: [
    {
      id: 'c470af25-3aad-4f68-919d-223a024b5915',
      name: 'Child 1',
      next: [
        'a340dec4-0d31-4270-bd5f-f7626c536cb3',
        'bff5e523-f494-456f-adac-ae4ef92fc7b2',
        'a72ab2db-6633-4b4f-bed7-faa58b422fbe',
      ],
    },
    {
      id: 'b1b0ab93-cc62-4174-9075-c55da94cd81b',
      name: 'Child 2',
      next: [
        '69cbbf97-3a1a-4473-b714-16d6505dfd34',
        '442683c3-3ee7-4fff-85b6-6208d0980065',
      ],
    },
    {
      id: '050ec079-60e5-4519-a3e1-f5dbed022f43',
      name: 'Child 3',
      next: [
        'd2835d70-5361-48d5-89cf-64cd41f4db7e',
        '1719fcf0-3adc-450e-8454-709275a01402',
        '5e0324fb-9c02-4968-9b0d-bc2975155fc1',
        '70b9e9c0-8eda-4922-b782-cef5fabd5a7f',
      ],
    },
  ],
  level2: [
    {
      id: 'a340dec4-0d31-4270-bd5f-f7626c536cb3',
      name: 'Grand Child 1',
      next: []
    },
    {
      id: 'bff5e523-f494-456f-adac-ae4ef92fc7b2',
      name: 'Grand Child 2',
      next: []
    },
    {
      id: 'a72ab2db-6633-4b4f-bed7-faa58b422fbe',
      name: 'Grand Child 3',
      next: []
    },
    {
      id: '69cbbf97-3a1a-4473-b714-16d6505dfd34',
      name: 'Grand Child 4',
      next: []
    },
    {
      id: '442683c3-3ee7-4fff-85b6-6208d0980065',
      name: 'Grand Child 5',
      next: []
    },
    {
      id: 'd2835d70-5361-48d5-89cf-64cd41f4db7e',
      name: 'Grand Child 6',
      next: []
    },
    {
      id: '1719fcf0-3adc-450e-8454-709275a01402',
      name: 'Grand Child 7',
      next: []
    },
    {
      id: '5e0324fb-9c02-4968-9b0d-bc2975155fc1',
      name: 'Grand Child 8',
      next: []
    },
    {
      id: '70b9e9c0-8eda-4922-b782-cef5fabd5a7f',
      name: 'Grand Child 9',
      next: []
    },
  ],
};
