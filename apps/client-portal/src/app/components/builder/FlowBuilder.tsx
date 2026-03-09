import { useState, useRef, useCallback, useEffect } from 'react';
import { Question } from '@/app/components/SurveyBuilder';
import { Plus, Trash2, ListChecks, Star, MessageSquare, Images } from 'lucide-react';

interface FlowNode {
  id: string;
  question: Question;
  position: { x: number; y: number };
  connections: { targetId: string; fromSide: 'left' | 'right' }[];
}

interface FlowBuilderProps {
  questions: Question[];
  selectedQuestionId: string | null;
  onSelectQuestion: (id: string) => void;
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
}

export function FlowBuilder({
  questions,
  selectedQuestionId,
  onSelectQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}: FlowBuilderProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Initialize nodes from questions
  const [nodes, setNodes] = useState<FlowNode[]>(() => {
    if (questions.length === 0) {
      return [{
        id: '1',
        question: {
          id: '1',
          type: 'multiple-choice',
          title: 'Start Your Survey',
          options: ['Option A', 'Option B'],
          required: false,
          randomize: false,
          isTrap: false,
        },
        position: { x: 400, y: 100 },
        connections: [],
      }];
    }
    return questions.map((q, index) => ({
      id: q.id,
      question: q,
      position: { x: 400, y: 100 + index * 250 },
      connections: [],
    }));
  });

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Sync question updates back to nodes
  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        const updatedQuestion = questions.find((q) => q.id === node.id);
        return updatedQuestion ? { ...node, question: updatedQuestion } : node;
      })
    );
  }, [questions]);

  const getQuestionIcon = (type: Question['type']) => {
    switch (type) {
      case 'multiple-choice':
        return ListChecks;
      case 'rating':
        return Star;
      case 'open-text':
        return MessageSquare;
      case 'image-select':
        return Images;
    }
  };

  const handleMouseDown = (e: React.MouseEvent, nodeId?: string) => {
    if (nodeId) {
      e.stopPropagation();
      setDraggingNode(nodeId);
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setDragOffset({
          x: e.clientX - node.position.x - panOffset.x,
          y: e.clientY - node.position.y - panOffset.y,
        });
      }
    } else {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggingNode) {
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === draggingNode
              ? {
                  ...node,
                  position: {
                    x: e.clientX - dragOffset.x - panOffset.x,
                    y: e.clientY - dragOffset.y - panOffset.y,
                  },
                }
              : node
          )
        );
      } else if (isPanning) {
        setPanOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    },
    [isPanning, panStart, draggingNode, dragOffset, panOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setDraggingNode(null);
  }, []);

  useEffect(() => {
    if (isPanning || draggingNode) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, draggingNode, handleMouseMove, handleMouseUp]);

  const handleAddNode = (parentId: string, side: 'left' | 'right') => {
    const parentNode = nodes.find((n) => n.id === parentId);
    if (!parentNode) return;

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      title: 'New Question',
      options: ['Option 1', 'Option 2'],
      required: false,
      randomize: false,
      isTrap: false,
    };

    const offsetX = side === 'right' ? 350 : -350;
    const offsetY = 150;

    const newNode: FlowNode = {
      id: newQuestion.id,
      question: newQuestion,
      position: {
        x: parentNode.position.x + offsetX,
        y: parentNode.position.y + offsetY,
      },
      connections: [],
    };

    setNodes((prev) => [
      ...prev.map((node) =>
        node.id === parentId
          ? {
              ...node,
              connections: [...node.connections, { targetId: newNode.id, fromSide: side }],
            }
          : node
      ),
      newNode,
    ]);

    onSelectQuestion(newQuestion.id);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (nodes.length === 1) return; // Don't delete the last node
    
    setNodes((prev) =>
      prev
        .filter((node) => node.id !== nodeId)
        .map((node) => ({
          ...node,
          connections: node.connections.filter((conn) => conn.targetId !== nodeId),
        }))
    );
    onDeleteQuestion(nodeId);
  };

  const renderConnections = () => {
    const connections: JSX.Element[] = [];

    nodes.forEach((node) => {
      node.connections.forEach((conn, idx) => {
        const targetNode = nodes.find((n) => n.id === conn.targetId);
        if (!targetNode) return;

        const startX = node.position.x + (conn.fromSide === 'right' ? 300 : 0);
        const startY = node.position.y + 80;
        const endX = targetNode.position.x + 150;
        const endY = targetNode.position.y;

        const midX = (startX + endX) / 2;
        const path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

        connections.push(
          <g key={`${node.id}-${conn.targetId}-${idx}`}>
            <path
              d={path}
              fill="none"
              stroke="#1A45FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
            />
          </g>
        );
      });
    });

    return connections;
  };

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ backgroundColor: '#F5F7FA' }}>
      {/* Canvas with dotted grid */}
      <div
        ref={canvasRef}
        className="w-full h-full absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, #D1D5DB 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
          cursor: isPanning ? 'grabbing' : 'grab',
        }}
        onMouseDown={(e) => handleMouseDown(e)}
      >
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          {/* SVG for connections */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '5000px',
              height: '5000px',
              pointerEvents: 'none',
              overflow: 'visible',
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#1A45FF" />
              </marker>
            </defs>
            {renderConnections()}
          </svg>

          {/* Question Nodes */}
          {nodes.map((node) => {
            const Icon = getQuestionIcon(node.question.type);
            const isSelected = selectedQuestionId === node.id;
            const isHovered = hoveredNode === node.id;

            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: node.position.x,
                  top: node.position.y,
                  width: '300px',
                  pointerEvents: 'auto',
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => {
                  setHoveredNode(null);
                  setHoveredSide(null);
                }}
              >
                {/* Left Plus Button */}
                {isHovered && (
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => handleAddNode(node.id, 'left')}
                    onMouseEnter={() => setHoveredSide('left')}
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
                    style={{
                      backgroundColor: '#1A45FF',
                      boxShadow: '0px 4px 8px rgba(26, 69, 255, 0.3)',
                    }}
                  >
                    <Plus size={20} style={{ color: '#FFFFFF', strokeWidth: 2.5 }} />
                  </button>
                )}

                {/* Question Card */}
                <div
                  onClick={() => onSelectQuestion(node.id)}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  className="rounded-2xl bg-white transition-all cursor-move relative"
                  style={{
                    border: isSelected ? '2px solid #1A45FF' : '1px solid #E5E7EB',
                    boxShadow: isSelected
                      ? '0px 12px 24px rgba(26, 69, 255, 0.15)'
                      : '0px 12px 24px rgba(0, 0, 0, 0.05)',
                    padding: '24px',
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#F0F3FF' }}
                    >
                      <Icon size={20} style={{ color: '#1A45FF', strokeWidth: 2 }} />
                    </div>
                    <div className="flex-1">
                      <span
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#6B7280',
                          textTransform: 'capitalize',
                        }}
                      >
                        {node.question.type.replace('-', ' ')}
                      </span>
                    </div>
                    {nodes.length > 1 && (
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} style={{ color: '#EF4444' }} />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={node.question.title}
                    onChange={(e) => onUpdateQuestion(node.id, { title: e.target.value })}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full border-none outline-none bg-transparent mb-3"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#192A56',
                    }}
                    placeholder="Enter question"
                  />

                  {node.question.options && (
                    <div className="space-y-2">
                      {node.question.options.slice(0, 2).map((option, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px',
                            color: '#6B7280',
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded-full border-2"
                            style={{ borderColor: '#D1D5DB' }}
                          />
                          {option}
                        </div>
                      ))}
                      {node.question.options.length > 2 && (
                        <div
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '12px',
                            color: '#9CA3AF',
                          }}
                        >
                          +{node.question.options.length - 2} more options
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Plus Button */}
                {isHovered && (
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => handleAddNode(node.id, 'right')}
                    onMouseEnter={() => setHoveredSide('right')}
                    className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
                    style={{
                      backgroundColor: '#1A45FF',
                      boxShadow: '0px 4px 8px rgba(26, 69, 255, 0.3)',
                    }}
                  >
                    <Plus size={20} style={{ color: '#FFFFFF', strokeWidth: 2.5 }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Zoom Controls */}
      <div
        className="absolute bottom-6 right-6 flex flex-col gap-2"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <button
          onClick={() => setScale(Math.min(scale + 0.1, 2))}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '20px',
            fontWeight: 600,
            color: '#192A56',
          }}
        >
          +
        </button>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: '#6B7280',
            textAlign: 'center',
          }}
        >
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={() => setScale(Math.max(scale - 0.1, 0.5))}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '20px',
            fontWeight: 600,
            color: '#192A56',
          }}
        >
          −
        </button>
      </div>
    </div>
  );
}