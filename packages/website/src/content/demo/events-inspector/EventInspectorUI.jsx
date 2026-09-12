import React, { useEffect, useCallback, useRef, useState } from 'react';
import {  
  EventCheckbox,
  canvasEvents,
  objectsEvents,
  LogEntry,
  eventGroups,
  EventGroupCheckbox
} from './demoComponents';
import * as fabric from 'fabric';
import './index.css';

// old html demo converted to a component with MINIMAL react adapatation.
// The react code written here has been written to remove the old code that was very contributor unfriendly.
// The react code has not been optimized or wrote to be a react best practice but it has written to just work.

export const EventInspectorUI = () => {
  const canvasRef = useRef();
  
  const logs = useRef([]);
  const [logsUpdated, setLogsUpdated] = useState(0);
  const eventStatusObj = useRef(
    Object.fromEntries(
      objectsEvents.map((key) => [key, false])
    )
  );
  const eventStatusCanvas = useRef(
    Object.fromEntries(
      canvasEvents.map((key) => [key, false])
    )
  );

  const logCallback = useCallback((eventData, eventName, forCanvas) => {
    const id = performance.now();
    if (forCanvas && !eventStatusCanvas.current[eventName]) {
      return;
    }
    if (!forCanvas && !eventStatusObj.current[eventName]) {
      return;
    }
    logs.current.push({ id, eventName, code: JSON.stringify(eventData, null, '\t') });
    logs.current = logs.current.slice(0, 100);
    setLogsUpdated(id);
  }, [setLogsUpdated]);

  useEffect(() => {
    fabric.FabricObject.ownDefaults.transparentCorners = false;
    const canvas = canvasRef.current = new fabric.Canvas('c1');
    canvas.add(
      new fabric.Rect({
        width: 50,
        height: 50,
        fill: 'red',
        top: 100,
        left: 100,
      })
    );
    canvas.add(
      new fabric.Rect({
        width: 30,
        height: 30,
        fill: 'green',
        top: 50,
        left: 50,
      })
    );
    canvas.add(
      new fabric.Circle({ radius: 20, fill: 'blue', top: 160, left: 140 })
    );
    canvas.add(
      new fabric.Textbox('Textbox edit and drag me on textbox 2', { fill: 'black', top: 70, left: 200 })
    );
    canvas.add(
      new fabric.Textbox('Textbox 2', { fill: 'black', top: 120, left: 400 })
    );

    canvasEvents.forEach((eventName) => {
      canvas.on(eventName, (eventData) => logCallback(eventData, eventName, true));
    });

    objectsEvents.forEach((eventName) => {
      canvas.getObjects().forEach((obj) => {
        obj.on(eventName, (eventData) => logCallback(eventData, eventName, false));
      });
    })
  }, []);

  const onChangeCanvas = useCallback((eventName, checked) => {
    console.log(checked, eventName)
    eventStatusCanvas.current[eventName] = checked;
    setLogsUpdated(performance.now());
  }, [eventStatusCanvas]);

  const onChangeObject = useCallback((eventName, checked) => {   
    eventStatusObj.current[eventName] = checked;
    setLogsUpdated(performance.now());
  }, [eventStatusObj]);

  const onChangeGroup = useCallback((groupName, checked) => {
    const group = eventGroups.find(group => group.id === groupName);
    if (!group) return;
    group.events.forEach((eventName) => {
      if (canvasEvents.includes(eventName)) {
        eventStatusCanvas.current[eventName] = checked;
      }
      if (objectsEvents.includes(eventName)) {
        eventStatusObj.current[eventName] = checked;
      }
      setLogsUpdated(performance.now());
    });
  }, [setLogsUpdated])

  // just the initial setup
  useEffect(() => {
    eventGroups.forEach(group => {
      group.events.forEach((eventName) => {
        if (canvasEvents.includes(eventName)) {
          eventStatusCanvas.current[eventName] = group.enabled;
        }
        if (objectsEvents.includes(eventName)) {
          eventStatusObj.current[eventName] = group.enabled;
        }
      });
    });
    setLogsUpdated(performance.now());
  }, [])

  return (
    <>
      <div className="demo-main">
        <div className="column-main">
          <p>To avoid event spamming, you can disable events groups.</p>
          <div>
            {eventGroups.map(group => (
              <EventGroupCheckbox
                key={group.id}
                groupName={group.id}
                label={group.label}
                onChange={onChangeGroup}
                initialChecked={group.enabled}
              />
            ))}
          </div>
          <div className="demo-body">
            <canvas id="c1" width="600" height="400"></canvas>
            <div>
              Drag me on the canvas
              <br />
              <br />
              <div
                id="drag-me"
                draggable="true"
                onDragStart={(event) =>
                  event.dataTransfer.setData('text/plain', '')
                }
              ></div>
            </div>
          </div>
          <div id="log1">{
            logs.current.map((logEntry, i) => (
              <LogEntry key={`${logEntry.id}-${i}`} logEntry={logEntry} color="blue" />
            ))
          }</div>
          <button id="clear_log" onClick={() => { logs.current=[]; setLogsUpdated(performance.now()) }}>clear log</button>
        </div>
        <div className="events-checkboxes">
          <div className="column-events">
            <div >
              <strong>Canvas events</strong>
            </div>
            {canvasEvents.map(eventKey => 
              <EventCheckbox key={`canvas_${eventKey}`} checked={eventStatusCanvas.current[eventKey]} onChange={onChangeCanvas} eventName={eventKey} />
            )}
          </div>
          <div className="column-events">
            <div>
              <strong>Objects events</strong>
            </div>
            {objectsEvents.map(eventKey => 
              <EventCheckbox key={`obj_${eventKey}`} checked={eventStatusObj.current[eventKey]} onChange={onChangeObject} eventName={eventKey} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
