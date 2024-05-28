export const data = {
  nodes: [
    {
      id: '0',
      title: 'Node 0'
    },
    {
      id: '1',
      title: 'Node 1'
    },
    {
      id: '2',
      title: 'Node 2'
    },
    {
      id: '3',
      title: 'Node 3'
    },
    {
      id: '4',
      title: 'Node 4'
    },
    {
      id: '5',
      title: 'Node 5'
    },
    {
      id: '6',
      title: 'Node 6'
    },
    {
      id: '7',
      title: 'Node 7'
    },
    {
      id: '8',
      title: 'Node 8'
    },
    {
      id: '9',
      title: 'Node 9'
    },
    {
      id: '10',
      title: 'Node 10'
    },
  ],
  relationships: [
    { source: '0', target: '1', type: 'primary' },
    { source: '1', target: '2', type: 'primary' },
    { source: '2', target: '3', type: 'primary' },
    { source: '3', target: '4', type: 'primary' },
    { source: '4', target: '5', type: 'primary' },
    { source: '5', target: '6', type: 'primary' },
    { source: '6', target: '7', type: 'primary' },
    { source: '7', target: '8', type: 'primary' },
    { source: '8', target: '9', type: 'primary' },
    { source: '9', target: '10', type: 'primary' },
    { source: '1', target: '4', type: 'secondary' },
    { source: '1', target: '7', type: 'secondary' },
    { source: '2', target: '4', type: 'secondary' },
    { source: '4', target: '8', type: 'secondary' },
    { source: '5', target: '8', type: 'secondary' },
    { source: '6', target: '10', type: 'secondary' },
    { source: '7', target: '9', type: 'secondary' },
  ]
};