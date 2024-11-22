import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { pdfjs, Document, Page } from "react-pdf";
import { ScrollArea } from "@/components/ui/scroll-area";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const UploadNotes = () => {
  const [currTab, setCurrTab] = useState("text");
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [fileName, setFileName] = useState<string | undefined>("");
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    // const plainText = e.replace(/<[^>]+>/g, "");
    // console.log(plainText);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    console.log(file);
    setFile(file);
    setFileName(file?.name);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  // Go to the next page
  function nextPage(e: React.MouseEvent) {
    e.preventDefault(); // Prevent page refresh
    setPageNumber((prev) => (prev < (numPages ?? 1) ? prev + 1 : prev));
  }

  // Go to the previous page
  function prevPage(e: React.MouseEvent) {
    e.preventDefault(); // Prevent page refresh
    setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
  }

  const handleSubmit = () => {};
  return (
    <section className="px-3 h-screen bg-neutral py-3 md:mx-36">
      <ScrollArea className="flex flex-col  h-[80vh] w-full">
        <div>Upload Options</div>
        <Tabs
          defaultValue="text"
          className="w-full"
          onValueChange={(e) => setCurrTab(e)}
        >
          <TabsList className="">
            <TabsTrigger
              className=" data-[state=active]:bg-orange-500"
              value="text"
            >
              Text/Inputted Notes
            </TabsTrigger>
            <TabsTrigger
              className=" data-[state=active]:bg-orange-500"
              value="file"
            >
              Upload PDF
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Note Name</Label>
                <Input
                  type="text"
                  placeholder="Note Name"
                  className=""
                  value={name}
                  onChange={handleOnChange}
                />
              </div>
              <Label>Notes</Label>
              <ReactQuill
                className="h-[400px]"
                theme="snow"
                value={note}
                onChange={setNote}
              />
              <div className="flex w-full mt-12 justify-end">
                <Button
                  className="self-end bg-orange-500 hover:bg-orange-600 text-white"
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="file">
            <form>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Note Name</Label>
                <Input
                  type="text"
                  placeholder="Note Name"
                  value={name}
                  onChange={handleOnChange}
                />
              </div>
              <div className="mt-2 grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file">Note File</Label>
                <div className="relative">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file"
                    className="w-full h-12 flex items-center justify-center border-2  border-gray-400  cursor-pointer"
                  >
                    {fileName ? fileName : "Choose a PDF file"}
                  </label>
                </div>
              </div>

              {file && (
                <div style={{ width: "100%", height: "80%" }}>
                  <button onClick={prevPage} disabled={pageNumber <= 1}>
                    Previous
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={pageNumber >= (numPages ?? -1)}
                  >
                    Next
                  </button>
                  <Document
                    file={URL.createObjectURL(file)}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="my-react-pdf"
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                </div>
              )}
              <div className="flex w-full mt-2 justify-end">
                <Button
                  className="self-end bg-orange-500 hover:bg-orange-600 text-white"
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </section>
  );
};

export default UploadNotes;
