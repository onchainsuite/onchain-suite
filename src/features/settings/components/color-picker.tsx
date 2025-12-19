import React from "react";

const ColorPicker = () => {
  return (
    <div>
      {/* Color Picker Modal */}
      <Dialog
        open={showColorPickerModal}
        onOpenChange={setShowColorPickerModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-tight text-[#111827]">
              Choose {colorPickerType} color
            </DialogTitle>
            <DialogDescription className="text-[#6b7280]">
              Select a color for your brand
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={
                  colorPickerType === "primary" ? primaryColor : secondaryColor
                }
                onChange={(e) =>
                  colorPickerType === "primary"
                    ? setPrimaryColor(e.target.value)
                    : setSecondaryColor(e.target.value)
                }
                className="h-16 w-16 cursor-pointer appearance-none overflow-hidden rounded-xl border-2 border-gray-200/80 bg-transparent lg:h-20 lg:w-20"
              />
              <Input
                value={
                  colorPickerType === "primary" ? primaryColor : secondaryColor
                }
                onChange={(e) =>
                  colorPickerType === "primary"
                    ? setPrimaryColor(e.target.value)
                    : setSecondaryColor(e.target.value)
                }
                className="h-12 flex-1 border-gray-200/80 font-mono uppercase"
              />
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-[#111827]">Presets</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "#10b981",
                  "#6366f1",
                  "#f59e0b",
                  "#ec4899",
                  "#8b5cf6",
                  "#14b8a6",
                  "#f43f5e",
                  "#3b82f6",
                ].map((color) => (
                  <motion.button
                    key={color}
                    onClick={() =>
                      colorPickerType === "primary"
                        ? setPrimaryColor(color)
                        : setSecondaryColor(color)
                    }
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-10 w-10 rounded-lg shadow-md transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowColorPickerModal(false)}
              className="border-gray-200/80"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(() => setShowColorPickerModal(false))}
              disabled={saving}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save color
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ColorPicker;
