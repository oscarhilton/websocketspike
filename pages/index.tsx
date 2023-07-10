import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import * as joint from 'jointjs';
import _ from 'lodash';

// Function to generate ShareDB operations for cell changes
function generateShareDBOperation(cellView, changeType) {
  const cell = cellView.model;
  const operation = {
    id: cell.id,
    type: cell.get('type'),
    position: cell.get('position'),
    size: cell.get('size'),
    attrs: cell.get('attrs'),
    changeType: changeType,
  };
  return operation;
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<joint.dia.Graph | null>(null);
  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Connect to the socket server
      const socket = io(); // Replace with your server URL
      socketRef.current = socket;

      // Receive the serialized paper from the server
      socket.on('paper', (data) => {
        const namespace = joint.shapes;
        const graph = new joint.dia.Graph({}, { cellNamespace: namespace });
        graphRef.current = graph;
        graph.fromJSON(JSON.parse(data));

        // Render the paper
        const paper = new joint.dia.Paper({
          el: containerRef.current,
          model: graph,
          width: '100%',
          height: '100%',
          cellViewNamespace: namespace,
        });

        // Listen to changes on all cells
        graph.getCells().forEach(cell => {
          cell.on('change', () => {
            // Send the changed cell data to the socket
            if (socketRef.current) {
              socketRef.current.emit('change', cell.toJSON());
            }
          });
        });

        // Prevent default behavior of events to disable native interactivity

        paper.on('cell:pointerdown', (cellView, evt) => {
          evt.preventDefault(); // Prevent the default behavior
          if (socketRef.current) {
            const operation = generateShareDBOperation(cellView, 'click');
            socketRef.current.emit('change', operation);
          }
        });

        paper.on('cell:pointermove', (cellView, evt) => {
          evt.preventDefault(); // Prevent the default behavior
          if (socketRef.current) {
            const operation = generateShareDBOperation(cellView, 'move');
            socketRef.current.emit('change', operation);
          }
        });

        paper.on('cell:pointerup', (cellView, evt) => {
          evt.preventDefault(); // Prevent the default behavior
          if (socketRef.current) {
            const operation = generateShareDBOperation(cellView, 'release');
            socketRef.current.emit('change', operation);
          }
        });
      });

      // Listen to server broadcasts for changes
      socket.on('update', (data) => {
        if (graphRef.current) {
          const changedCellData = JSON.parse(data);
          const cell = graphRef.current.getCell(changedCellData.id);
          if (cell) {
            const mergedCellData = applyChange(cell.toJSON(), changedCellData);
            cell.prop(mergedCellData);
          } else {
            graphRef.current.fromJSON({ cells: [changedCellData] });
          }
        }
      });
    }
  }, []);

  function applyChange(currentState, change) {
    return Object.assign({}, currentState, change);
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
