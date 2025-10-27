"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PopupFormsPromoProps {
  onTryOut: () => void;
  onDismiss: () => void;
}

export function PopupFormsPromo({ onTryOut, onDismiss }: PopupFormsPromoProps) {
  return (
    <Card className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0"
        onClick={onDismiss}
      >
        <X className="h-4 w-4" />
      </Button>

      <CardHeader>
        <CardTitle className="text-lg">
          Grow more and know more with new customizable popup forms
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-muted-foreground mb-4 text-sm">
              Grow your email and SMS lists and collect customer data with popup
              forms. Use custom filters to display relevant content and mini
              quizzes to learn more about your visitors. Build a form today—no
              coding needed.
            </p>
            <p className="text-muted-foreground text-xs">
              SMS available as add-on to paid plans after application and
              agreement to terms. See terms.
            </p>
          </div>

          <div className="ml-4 shrink-0">
            <div className="flex h-20 w-32 items-center justify-center rounded-lg bg-gradient-to-r from-yellow-400 to-pink-500">
              <div className="text-center text-xs font-bold text-white">
                20% OFF
                <br />
                your first
                <br />
                order
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={onTryOut}>Try it out</Button>
          <Button variant="outline" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
