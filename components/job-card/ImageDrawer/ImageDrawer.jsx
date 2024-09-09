"use client";
import { useRef, useState, useEffect } from "react";
import { IoArrowUndoCircle, IoArrowRedoCircle } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaEraser } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadDamageImageAction } from "@/action/employeeAction/jobcard-action";
import { useParams, useRouter } from "next/navigation";
import {
  addJobCard,
  getSingleJobCardAction,
  updateJobCardAction,
  getInsuranceValidAction,
} from "@/action/employeeAction/jobcard-action";
import { RxReset } from "react-icons/rx";


const ImageDrawer = ({ setImageForJobCard }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [imageSrc, setImageSrc] = useState("/images/sheme_auto_01.jpg");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isErasing, setIsErasing] = useState(false);
  const [drawingLayer, setDrawingLayer] = useState(null);
  const [cursorStyle, setCursorStyle] = useState('crosshair');

  const { update_Jobcard } = useParams();
  const [paramId, setParamId] = useState(null);


  //


  useEffect(() => {
    if (update_Jobcard && update_Jobcard.length > 0) {
      // setJobCardId(update_Jobcard[0]);
      setParamId(update_Jobcard[0]);
    }
  }, [update_Jobcard]);



  const {
    isLoading: isLoadingCompanyData,
    isError: isErrorCompanyData,
    data: jobcardData,
    error: companyDataError,
  } = useQuery({
    queryKey: ["jobcardData1", paramId],
    queryFn: () => getSingleJobCardAction(paramId),
    enabled: !!paramId, // Only enable query if customerId is truthy
    retry: false,
    onSuccess: (data) => {
      //setJobCardDataResponse(data);
    },
  });

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  useEffect(() => {
    if (update_Jobcard && update_Jobcard.length > 0 && jobcardData && jobcardData.markDamageImg) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = `${baseURL}${jobcardData.markDamageImg}`;
      setImageSrc(img.src);
    }
  }, [update_Jobcard, jobcardData, baseURL]);
  //

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    setCursorStyle(prevStyle => prevStyle === 'crosshair' ? 'eraser' : 'crosshair');
  };






  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = cursorStyle === 'eraser'
        ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18.41 2l3.59 3.59-12.41 12.41-7.59-7.59 12.41-12.41zm-14.41 15l-2 2h5.59l2-2h-5.59z"/></svg>') 12 12, auto`
        : 'crosshair';
    }
  }, [cursorStyle]);
  const loadImage = () => {
    const img = imageRef.current;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const maxWidth = window.innerWidth * 0.8;
      const maxHeight = window.innerHeight * 0.8;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const drawingCanvas = document.createElement('canvas');
      drawingCanvas.width = width;
      drawingCanvas.height = height;
      setDrawingLayer(drawingCanvas);

      saveState(canvas, drawingCanvas);
    };
  };
  const handleResize = () => {
    loadImage();
  };

  useEffect(() => {
    loadImage();
    window.addEventListener("resize", handleResize);
  
    // Prevent default touch behavior for canvas
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
      canvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
      canvas.addEventListener("touchend", (e) => e.preventDefault(), { passive: false });
    }
  
    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("touchstart", (e) => e.preventDefault());
        canvas.removeEventListener("touchmove", (e) => e.preventDefault());
        canvas.removeEventListener("touchend", (e) => e.preventDefault());
      }
    };
  }, [imageSrc]);


  const saveState = (canvas, drawingCanvas) => {
    if (!canvas || !drawingCanvas) return;
    const dataUrl = canvas?.toDataURL();
    setUndoStack((prev) => [...prev, { canvas: dataUrl, drawing: drawingCanvas.toDataURL() }]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const redoState = undoStack.pop();
      setRedoStack((prev) => [...prev, redoState]);

      const lastState = undoStack[undoStack.length - 1];
      if (lastState) {
        const img = new Image();
        img.src = lastState.canvas;
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          const drawingImg = new Image();
          drawingImg.src = lastState.drawing;
          drawingImg.onload = () => {
            drawingLayer.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            drawingLayer.getContext("2d").drawImage(drawingImg, 0, 0);
          };
        };
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
        drawingLayer.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      }

      setUndoStack([...undoStack]);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const nextState = redoStack.pop();
      if (nextState) {
        const img = new Image();
        img.src = nextState.canvas;
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          const drawingImg = new Image();
          drawingImg.src = nextState.drawing;
          drawingImg.onload = () => {
            drawingLayer.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            drawingLayer.getContext("2d").drawImage(drawingImg, 0, 0);
          };
        };
      }

      setUndoStack((prev) => [...prev, nextState]);
      setRedoStack([...redoStack]);
    }
  };

  // const startDrawing = (e) => {
  //   if (!drawingLayer) return;
  //   const drawingCtx = drawingLayer.getContext("2d");
  //   drawingCtx.beginPath();
  //   drawingCtx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  //   setDrawing(true);
  // };


  const startDrawing = (e) => {
  e.preventDefault(); // Prevent scrolling on touch devices
  if (!drawingLayer) return;

  const pos = getEventPosition(e);
  const drawingCtx = drawingLayer.getContext("2d");
  drawingCtx.beginPath();
  drawingCtx.moveTo(pos.x, pos.y);
  setDrawing(true);
};

const draw = (e) => {
  e.preventDefault(); // Prevent scrolling on touch devices
  if (!drawing || !drawingLayer) return;

  const pos = getEventPosition(e);
  const drawingCtx = drawingLayer.getContext("2d");
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  drawingCtx.lineTo(pos.x, pos.y);

  if (isErasing) {
    drawingCtx.globalCompositeOperation = "destination-out";
    drawingCtx.strokeStyle = "rgba(255,255,255,1)";
    drawingCtx.lineWidth = 20;
  } else {
    drawingCtx.globalCompositeOperation = "source-over";
    drawingCtx.strokeStyle = "red";
    drawingCtx.lineWidth = 2;
  }

  drawingCtx.stroke();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(drawingLayer, 0, 0);
};


  // const stopDrawing = () => {
  //   if (!drawing || !drawingLayer) return;
  //   setDrawing(false);
  //   saveState(canvasRef.current, drawingLayer);

  //   const drawingCtx = drawingLayer.getContext("2d");
  //   drawingCtx.globalCompositeOperation = "source-over";
  // };
  //

  const stopDrawing = (e) => {
    e.preventDefault(); // Prevent scrolling on touch devices
    if (drawing) {
      const canvas = canvasRef.current;
      saveState(canvas, drawingLayer);
      setDrawing(false);
    }
  };


  const uploadDataMutation = useMutation({
    mutationKey: ["uploadDataMutation"],
    mutationFn: async (data) => {
      return await uploadDamageImageAction(data);
    },
    onSuccess: (response) => {
      setImageForJobCard(response?.link)
      toast.success("Damage Marked Saved ");
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });



  const getEventPosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };



  //
  const saveImage = async () => {
    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      // const formData = new FormData();
      // formData.append('image', blob, 'drawn-image.png');
      const dataURLt = canvas.toDataURL("image/png");
      const payLoad = { dataURL: dataURLt }
      await uploadDataMutation.mutateAsync(payLoad);
    }, 'image/png');
  };

  const handleReset = () => {
    setImageSrc("/images/sheme_auto_01.jpg");
  };

  return (
    <>
      <div className="flex flex-col items-center min-w-full">
        <Label htmlFor="Damage" className="block mb-3">
          Mark Damage Part of Car
        </Label>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            border: "1px solid black",
            maxWidth: "100%",
            maxHeight: "80vh",
            cursor: cursorStyle,
          }}
        ></canvas>
        <img
          ref={imageRef}
          src={imageSrc}
          alt="To draw on"
          style={{ display: "none" }}
        />
        <div
          style={{ marginTop: "10px" }}
          className="flex justify-center items-center gap-4"
        >
          <button onClick={undo} disabled={undoStack.length === 1} type="button">
            <IoArrowUndoCircle size={28} className="text-[#08AFA4]" />
          </button>
          <button onClick={redo} disabled={redoStack.length === 0} type="button">
            <IoArrowRedoCircle size={28} className="text-[#08AFA4]" />
          </button>
          <button
            onClick={toggleEraser}
            type="button"
            className={`p-2 rounded ${isErasing ? 'bg-gray-300' : ''}`}
          >
            <FaEraser size={20} className={isErasing ? 'text-blue-500' : 'text-gray-500'} />
          </button>
          <button
            onClick={handleReset}
            type="button"
            className={`p-2 rounded border bg-red-900}`}
          >
            <RxReset size={20} className={'text-red-500 font-extrabold'} />
          </button>
          <Button
            onClick={saveImage}
            type="button"
            color="success"
            variant="outline"
          >
            Save Image
          </Button>
        </div>
      </div>
    </>
  );
};

export default ImageDrawer;