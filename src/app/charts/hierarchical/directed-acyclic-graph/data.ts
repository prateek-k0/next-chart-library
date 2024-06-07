export interface DataItemType {
  id: string;
  name: string;
  next: string[];
}

export interface TreeNode extends DataItemType {
  // children: TreeNode[];
  // _children: TreeNode[];
  depth: number;
  x?: number,
  y?: number,
  isCollapsed: boolean,
}

export interface DataType {
  [prop: string]: DataItemType[];
}

export const data: DataType = {
  level0: [
    {
      id: "6420c09f-14de-44e9-894d-1b489943e445",
      name: "Operating Profit",
      next: [
        "c2940bd2-2743-40c0-9ada-b81af53429be",
        "f2234b7f-9dd6-44b9-9947-8093cbc64532",
      ],
    },
    {
      id: "cd044e2a-0d49-4ab2-aaa8-cb4a2d8b3e84",
      name: "Cap EX",
      next: [
        "d72d2bca-9a1b-4c19-a1c6-d3ea6dea0ac9",
        "050ec079-60e5-4519-a3e1-f5dbed022f43",
      ],
    },
    {
      id: "c470af25-3aad-4f68-919d-223a024b5915",
      name: "Brand Perception",
      next: [
        "050ec079-60e5-4519-a3e1-f5dbed022f43",
        "f2234b7f-9dd6-44b9-9947-8093cbc64532",
      ],
    },
    {
      id: "881a266d-2ad4-4b63-a6f2-9e7c0146b1bd",
      name: "Automation Value",
      next: ["513c91cd-2ad8-49aa-bd6a-c592130bf916"],
    },
  ],
  level1: [
    {
      id: "c2940bd2-2743-40c0-9ada-b81af53429be",
      name: "Operating Margins",
      next: [
        "c6cf98c9-cb66-42f6-a4a2-6dd0f95cae92",
        "8172ed0a-ad2e-4d3d-a06c-006ef632baa9",
      ],
    },
    {
      id: "d72d2bca-9a1b-4c19-a1c6-d3ea6dea0ac9",
      name: "Capital Spend",
      next: [
        "ce440095-e87f-45ca-a6f7-56ad8b6369cc",
        "10a0749b-c06d-42f1-984a-046398a9a73b",
      ],
    },
    {
      id: "f2234b7f-9dd6-44b9-9947-8093cbc64532",
      name: "Environmental Impact",
      next: [
        "bff5e523-f494-456f-adac-ae4ef92fc7b2",
        "7d8baeaa-914c-4e86-a9ee-99ff7081bdfb",
      ],
    },
    {
      id: "050ec079-60e5-4519-a3e1-f5dbed022f43",
      name: "Public Trust Index",
      next: [
        "bff5e523-f494-456f-adac-ae4ef92fc7b2",
        "4786c622-9ba8-4fb5-98a2-453b13615934",
      ],
    },
    {
      id: "513c91cd-2ad8-49aa-bd6a-c592130bf916",
      name: "Automation Value 2",
      next: ["d00f74df-7048-471b-af23-5c18f41b7b63"],
    },
  ],
  level2: [
    {
      id: "c6cf98c9-cb66-42f6-a4a2-6dd0f95cae92",
      name: "Gross Margins",
      next: [
        "d1af2daa-b412-46aa-af91-549b553ea381",
        "c16a998f-c7b7-4b27-a0c0-4b6e4d35e649",
        "f3e17c9b-f1ad-41b3-b6db-77ba39bb4920",
      ],
    },
    {
      id: "ce440095-e87f-45ca-a6f7-56ad8b6369cc",
      name: "Project Cost",
      next: ["16c95bfa-0c3b-45be-b459-16b4464a0a5f"],
    },
    {
      id: "bff5e523-f494-456f-adac-ae4ef92fc7b2",
      name: "Governance risk",
      next: [
        "ce55d96e-4318-4e25-8701-7f22fbfd0814",
        "6206e1a1-494d-4f95-9779-2ea2f0ff4ea3",
      ],
    },
    {
      id: "10a0749b-c06d-42f1-984a-046398a9a73b",
      name: "Total Assets",
      next: ["7612c51a-5f4a-484d-b78f-ba7e13f63390"],
    },
    {
      id: "8172ed0a-ad2e-4d3d-a06c-006ef632baa9",
      name: "Operating Expenses",
      next: [
        "69cbbf97-3a1a-4473-b714-16d6505dfd34",
        "c96e6ef8-3e94-492d-8ffc-7c939d07e636",
      ],
    },
    {
      id: "4786c622-9ba8-4fb5-98a2-453b13615934",
      name: "Public & Social Trust",
      next: ["2276d5b0-fa6a-413d-ab1d-eb0f1798c10a"],
    },
    {
      id: "7d8baeaa-914c-4e86-a9ee-99ff7081bdfb",
      name: "Risks",
      next: ["928f690b-5ac2-4887-9e96-17091e55e136"],
    },
    {
      id: "d00f74df-7048-471b-af23-5c18f41b7b63",
      name: "Contingencies",
      next: ["96ee1b4d-1880-4478-a17b-15ae2b5cfbaf"],
    },
  ],
  level3: [
    {
      id: "d1af2daa-b412-46aa-af91-549b553ea381",
      name: "Reduce Operating Costs",
      next: [
        "d1f7a939-867a-487d-bc76-0d2b8b64ffc8",
        "d1cdf910-5818-45db-bdc1-a5c01c7ca45c",
        "a9561af4-fb64-44e2-a5aa-18ac1ae57086",
      ],
    },
    {
      id: "16c95bfa-0c3b-45be-b459-16b4464a0a5f",
      name: "Reduce Capital Costs",
      next: [
        "f68114a4-50a5-4330-9586-5985d7ac7ffb",
        "fecd6c22-05dc-44f9-9f13-1c855e5853e2",
        "6b20e6a0-3682-41e4-977e-4fbb96d5189c",
        "d1cdf910-5818-45db-bdc1-a5c01c7ca45c",
        "856b04b9-35c6-4b4e-91c3-2de1ea33851a",
      ],
    },
    {
      id: "ce55d96e-4318-4e25-8701-7f22fbfd0814",
      name: "Ensure ethicality",
      next: ["f68114a4-50a5-4330-9586-5985d7ac7ffb"],
    },
    {
      id: "c16a998f-c7b7-4b27-a0c0-4b6e4d35e649",
      name: "Increase Margins",
      next: [
        "fb6d4954-22f1-4640-8c54-18681aacc9a7",
        "fecd6c22-05dc-44f9-9f13-1c855e5853e2",
        "111172b2-fbaf-4f27-be12-ca59d760de70",
        "2391e85f-7229-4ce1-bd29-c01555304abc",
        "5a04a1d5-ffe6-4a2d-b087-0ceb1f05fef3",
        "9301bcfe-804a-43df-99a3-6771c17eea8d",
        "6b20e6a0-3682-41e4-977e-4fbb96d5189c",
        "af09060f-68e3-4ee5-91c2-e57372e341a6",
      ],
    },
    {
      id: "6206e1a1-494d-4f95-9779-2ea2f0ff4ea3",
      name: "Growth Drivers",
      next: ["17cdd7aa-4785-4b63-af48-fecf5df6c8a1"],
    },
    {
      id: "7612c51a-5f4a-484d-b78f-ba7e13f63390",
      name: "Reduce working capital",
      next: ["faa7d515-cf4e-48d7-8344-c338a1c5f95a"],
    },
    {
      id: "69cbbf97-3a1a-4473-b714-16d6505dfd34",
      name: "Reduce Operating Expenses",
      next: [
        "c4c2347f-e5b1-43c9-b49d-ab9a27efb05a",
        "8fb62927-f4f2-46fb-871d-72161888a7e9",
        "17cdd7aa-4785-4b63-af48-fecf5df6c8a1",
        "7fbad52f-f907-4753-b4d6-8b3a023569ec",
        "66415eb0-1c56-40f7-8e46-f2142557a657",
        "60145ff7-6687-45e6-9292-1f912cf002b7",
      ],
    },
    {
      id: "c96e6ef8-3e94-492d-8ffc-7c939d07e636",
      name: "Reduce Maintenance Cost",
      next: ["af09060f-68e3-4ee5-91c2-e57372e341a6"],
    },
    {
      id: "f3e17c9b-f1ad-41b3-b6db-77ba39bb4920",
      name: "Reduces labour force",
      next: ["4ebf397d-2af3-40ce-9065-99e020f653d9"],
    },
    {
      id: "2276d5b0-fa6a-413d-ab1d-eb0f1798c10a",
      name: "Increase Scope for HR",
      next: [
        "a9561af4-fb64-44e2-a5aa-18ac1ae57086",
        "c4c2347f-e5b1-43c9-b49d-ab9a27efb05a",
      ],
    },
    {
      id: "928f690b-5ac2-4887-9e96-17091e55e136",
      name: "Growth Drivers 2",
      next: ["af09060f-68e3-4ee5-91c2-e57372e341a6"],
    },
    {
      id: "96ee1b4d-1880-4478-a17b-15ae2b5cfbaf",
      name: "Multi Dimensionality",
      next: ["5d4894c6-bbb8-4dac-8eb2-62497c59601b"],
    },
  ],
  level4: [
    {
      id: "d1f7a939-867a-487d-bc76-0d2b8b64ffc8",
      name: "Reduce Production Losses",
      next: ["3f634f20-85e5-411c-9bdc-0e8f71476cd8"],
    },
    {
      id: "f68114a4-50a5-4330-9586-5985d7ac7ffb",
      name: "Better Knowledge Management",
      next: ["6a332a93-fc1a-4a94-bcbe-bb7081cfe074"],
    },
    {
      id: "fb6d4954-22f1-4640-8c54-18681aacc9a7",
      name: "Improve Asset Performance",
      next: ["049f06e5-2c40-4d9d-965d-bb087a606067"],
    },
    {
      id: "17cdd7aa-4785-4b63-af48-fecf5df6c8a1",
      name: "Automated Test Execution, Evaluation",
      next: ["6a332a93-fc1a-4a94-bcbe-bb7081cfe074"],
    },
    {
      id: "faa7d515-cf4e-48d7-8344-c338a1c5f95a",
      name: "Utilise Analytics for Planning & Execution",
      next: ["049f06e5-2c40-4d9d-965d-bb087a606067"],
    },
    {
      id: "c4c2347f-e5b1-43c9-b49d-ab9a27efb05a",
      name: "Reduce Returns / Recalls",
      next: ["6a332a93-fc1a-4a94-bcbe-bb7081cfe074"],
    },
    {
      id: "fecd6c22-05dc-44f9-9f13-1c855e5853e2",
      name: "Increased Operational Performance",
      next: ["049f06e5-2c40-4d9d-965d-bb087a606067"],
    },
    {
      id: "af09060f-68e3-4ee5-91c2-e57372e341a6",
      name: "Improve Product Quality",
      next: [
        "0e290bc8-c480-49c6-aaa0-d2469f3f9902",
        "049f06e5-2c40-4d9d-965d-bb087a606067",
      ],
    },
    {
      id: "8fb62927-f4f2-46fb-871d-72161888a7e9",
      name: "Reduce R&D Expenses",
      next: ["6a332a93-fc1a-4a94-bcbe-bb7081cfe074"],
    },
    {
      id: "111172b2-fbaf-4f27-be12-ca59d760de70",
      name: "Improve Product Success rate",
      next: [
        "049f06e5-2c40-4d9d-965d-bb087a606067",
        "6a332a93-fc1a-4a94-bcbe-bb7081cfe074",
      ],
    },
    {
      id: "2391e85f-7229-4ce1-bd29-c01555304abc",
      name: "Reduce Lead Time / Time To Market",
      next: [
        "7b110613-4f22-4fb4-9da6-dd0b60b2f282",
        "049f06e5-2c40-4d9d-965d-bb087a606067",
      ],
    },
    {
      id: "d1cdf910-5818-45db-bdc1-a5c01c7ca45c",
      name: "Reduce Rework",
      next: [
        "6a332a93-fc1a-4a94-bcbe-bb7081cfe074",
        "0e290bc8-c480-49c6-aaa0-d2469f3f9902",
      ],
    },
    {
      id: "4ebf397d-2af3-40ce-9065-99e020f653d9",
      name: "Reduce Rework 2",
      next: ["049f06e5-2c40-4d9d-965d-bb087a606067"],
    },
    {
      id: "a9561af4-fb64-44e2-a5aa-18ac1ae57086",
      name: "Reduce Production Waste",
      next: [
        "049f06e5-2c40-4d9d-965d-bb087a606067",
        "7b110613-4f22-4fb4-9da6-dd0b60b2f282",
        "0e290bc8-c480-49c6-aaa0-d2469f3f9902",
        "6a332a93-fc1a-4a94-bcbe-bb7081cfe074",
      ],
    },
    {
      id: "7fbad52f-f907-4753-b4d6-8b3a023569ec",
      name: "Improve Design Reusability",
      next: ["7b110613-4f22-4fb4-9da6-dd0b60b2f282"],
    },
    {
      id: "6b20e6a0-3682-41e4-977e-4fbb96d5189c",
      name: "Improved Lifecycle Cost",
      next: ["7b110613-4f22-4fb4-9da6-dd0b60b2f282"],
    },
    {
      id: "5a04a1d5-ffe6-4a2d-b087-0ceb1f05fef3",
      name: "Improve Customer Satisfaction",
      next: ["6a332a93-fc1a-4a94-bcbe-bb7081cfe074"],
    },
    {
      id: "66415eb0-1c56-40f7-8e46-f2142557a657",
      name: "Improve Workforce Planning",
      next: ["049f06e5-2c40-4d9d-965d-bb087a606067"],
    },
    {
      id: "9301bcfe-804a-43df-99a3-6771c17eea8d",
      name: "Value Added Services",
      next: ["049f06e5-2c40-4d9d-965d-bb087a606067"],
    },
    {
      id: "5d4894c6-bbb8-4dac-8eb2-62497c59601b",
      name: "VAD 2",
      next: ["6a332a93-fc1a-4a94-bcbe-bb7081cfe074"],
    },
    {
      id: "60145ff7-6687-45e6-9292-1f912cf002b7",
      name: "Reduce Warranty and Returns",
      next: [
        "7b110613-4f22-4fb4-9da6-dd0b60b2f282",
        "6a332a93-fc1a-4a94-bcbe-bb7081cfe074",
      ],
    },
    {
      id: "856b04b9-35c6-4b4e-91c3-2de1ea33851a",
      name: "Improved Quality Management",
      next: ["3f634f20-85e5-411c-9bdc-0e8f71476cd8"],
    },
  ],
  level5: [
    {
      id: "6a332a93-fc1a-4a94-bcbe-bb7081cfe074",
      name: "Cost Of Poor Quality (COPQ)",
      next: [],
    },
    {
      id: "049f06e5-2c40-4d9d-965d-bb087a606067",
      name: "Quality Deviations",
      next: [],
    },
    {
      id: "7b110613-4f22-4fb4-9da6-dd0b60b2f282",
      name: "Design cycle time",
      next: [],
    },
    {
      id: "0e290bc8-c480-49c6-aaa0-d2469f3f9902",
      name: "Transit Loss",
      next: [],
    },
    {
      id: "3f634f20-85e5-411c-9bdc-0e8f71476cd8",
      name: "Inspection Rejection Rate",
      next: [],
    },
  ],
};
