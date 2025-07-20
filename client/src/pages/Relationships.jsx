import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import { useParams } from "react-router-dom";
import { getUserRelations } from '../apis/Users';


const Relationships = () => {
  const { userId } = useParams();
  const cyRef = useRef(null);
  const containerRef = useRef(null);
  const [elements, setElements] = useState([]);

  // Helper to create a node with unique id and label
  const makeNode = (id, label, type = 'user') => ({ data: { id, label, type } });

  // Transform API data to Cytoscape elements
  const transformRelationsToElements = (relations) => {
    const nodesMap = new Map();
    const edges = [];
    const edgeSet = new Set();

    relations.forEach(rel => {
      const { relationship, source, target, data } = rel;
      let sourceId, targetId, sourceLabel, targetLabel, sourceType = 'user', targetType = 'user';

      if (relationship === 'SHARED_ATTRIBUTE') {
        // Both source and target are users
        sourceId = source.id || source.email || JSON.stringify(source);
        targetId = target.id || target.email || JSON.stringify(target);
        sourceLabel = source.name || source.email || 'User';
        targetLabel = target.name || target.email || 'User';
        sourceType = targetType = 'user';
      } else if (relationship === 'CREDIT' || relationship === 'DEBIT') {
        // User and Transaction
        sourceId = source.id || source.email || JSON.stringify(source);
        targetId = target.id || target.transaction_id || JSON.stringify(target);
        sourceLabel = source.name || source.email || 'User';
        targetLabel = `IP: ${target.ip || '-'} \n Amt: ${target.amount || '-'} \n User: ${sourceLabel}`;
        sourceType = 'user';
        targetType = 'transaction';
      } else if (relationship === 'RELATED_TO') {
        // Transaction to Transaction
        sourceId = source.id || source.transaction_id || JSON.stringify(source);
        targetId = target.id || target.transaction_id || JSON.stringify(target);
        sourceLabel = `IP: ${source.ip || '-'}\nAmt: ${source.amount || '-'}`;
        targetLabel = `IP: ${target.ip || '-'}\nAmt: ${target.amount || '-'}`;
        sourceType = targetType = 'transaction';
      } else {
        // fallback
        sourceId = source.id || JSON.stringify(source);
        targetId = target.id || JSON.stringify(target);
        sourceLabel = source.name || 'Node';
        targetLabel = target.name || 'Node';
      }

      // Add nodes if not already present
      if (!nodesMap.has(sourceId)) nodesMap.set(sourceId, makeNode(sourceId, sourceLabel, sourceType));
      if (!nodesMap.has(targetId)) nodesMap.set(targetId, makeNode(targetId, targetLabel, targetType));

      // Add edges, avoid duplicates
      const edgeKey = (a, b, rel) => `${a}|${b}|${rel}`;
      const relType = String(relationship).trim();
      if (relType === 'SHARED_ATTRIBUTE' || relType === 'RELATED_TO') {
        // Add bidirectional edges if not already present
        const key1 = edgeKey(sourceId, targetId, relType);
        const key2 = edgeKey(targetId, sourceId, relType);
        if (!edgeSet.has(key1)) {
          edges.push({ data: { source: sourceId, target: targetId, label: relType, relationshipType: relType } });
          edgeSet.add(key1);
        }
        if (!edgeSet.has(key2)) {
          edges.push({ data: { source: targetId, target: sourceId, label: relType, relationshipType: relType } });
          edgeSet.add(key2);
        }
      } else {
        // Unidirectional edge
        const key = edgeKey(sourceId, targetId, relType);
        if (!edgeSet.has(key)) {
          edges.push({ data: { source: sourceId, target: targetId, label: relType, relationshipType: relType } });
          edgeSet.add(key);
        }
      }
    });

    return [...nodesMap.values(), ...edges];
  };

  useEffect(() => {
    // Fetch user relations when userId changes
    const fetchData = async () => {
      if (!userId) return;
      try {
        const data = await getUserRelations({ id: userId });
        const elements = transformRelationsToElements(data);
        setElements(elements);
      } catch (error) {
        setElements([]);
        // Optionally, show an error message
        // toast.error('Failed to fetch user relations');
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (containerRef.current && elements.length > 0) {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
      cyRef.current = cytoscape({
        container: containerRef.current,
        elements: elements,
        style: [
          // User node
          {
            selector: 'node[type = "user"]',
            style: {
              'background-color': '#0074D9',
              'label': 'data(label)',
              'color': '#fff',
              'text-valign': 'center',
              'text-halign': 'center',
              'font-size': 16,
              'width': 'label',
              'height': 'label',
              'padding': '10px',
              'min-width': 40,
              'min-height': 40,
              'text-wrap': 'wrap',
              'text-max-width': 120,
            }
          },
          // Transaction node
          {
            selector: 'node[type = "transaction"]',
            style: {
              'background-color': '#F59E42',
              'label': 'data(label)',
              'color': '#222',
              'text-valign': 'center',
              'text-halign': 'center',
              'font-size': 16,
              'width': 'label',
              'height': 'label',
              'padding': '10px',
              'min-width': 40,
              'min-height': 40,
              'text-wrap': 'wrap',
              'text-max-width': 120,
            }
          },
          // SHARED_ATTRIBUTE edge
          {
            selector: 'edge[relationshipType = "SHARED_ATTRIBUTE"]',
            style: {
              'width': 3,
              'line-color': '#22c55e',
              'target-arrow-color': '#22c55e',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': 12,
              'color': '#333',
            }
          },
          // CREDIT edge
          {
            selector: 'edge[relationshipType = "CREDIT"]',
            style: {
              'width': 3,
              'line-color': '#2563eb',
              'target-arrow-color': '#2563eb',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': 12,
              'color': '#333',
            }
          },
          // DEBIT edge
          {
            selector: 'edge[relationshipType = "DEBIT"]',
            style: {
              'width': 3,
              'line-color': '#dc2626',
              'target-arrow-color': '#dc2626',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': 12,
              'color': '#333',
            }
          },
          // RELATED_TO edge
          {
            selector: 'edge[relationshipType = "RELATED_TO"]',
            style: {
              'width': 3,
              'line-color': '#f59e42',
              'target-arrow-color': '#f59e42',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': 12,
              'color': '#333',
            }
          },
          // fallback edge
          {
            selector: 'edge',
            style: {
              'width': 3,
              'line-color': '#aaa',
              'target-arrow-color': '#aaa',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': 12,
              'color': '#333',
            }
          }
        ],
        layout: {
          name: 'cose',
        },
      });
    }
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [elements]);

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-6">Relationships Graph</h1>
      <div className="w-full max-w-4xl bg-black rounded shadow p-4">
        <div className="mb-4 text-lg font-semibold text-white">Relationships</div>
        <div ref={containerRef} style={{ width: '100%', height: '500px', background: '#f3f4f6', borderRadius: '8px' }} />
        {/* Legend Section at the end */}
        <div className="flex flex-row flex-wrap gap-8 mt-6">
          <div className="flex items-center gap-2">
            <span style={{width: 20, height: 20, borderRadius: '50%', background: '#0074D9', display: 'inline-block', border: '2px solid #333'}}></span>
            <span className="text-gray-300 text-sm">User Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{width: 20, height: 20, borderRadius: '50%', background: '#F59E42', display: 'inline-block', border: '2px solid #333'}}></span>
            <span className="text-gray-300 text-sm">Transaction Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{width: 30, height: 0, borderTop: '3px solid #22c55e', display: 'inline-block', marginRight: 4}}></span>
            <span className="text-gray-300 text-sm">SHARED_ATTRIBUTE</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{width: 30, height: 0, borderTop: '3px solid #2563eb', display: 'inline-block', marginRight: 4}}></span>
            <span className="text-gray-300 text-sm">CREDIT</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{width: 30, height: 0, borderTop: '3px solid #dc2626', display: 'inline-block', marginRight: 4}}></span>
            <span className="text-gray-300 text-sm">DEBIT</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{width: 30, height: 0, borderTop: '3px solid #f59e42', display: 'inline-block', marginRight: 4}}></span>
            <span className="text-gray-300 text-sm">RELATED_TO</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relationships;