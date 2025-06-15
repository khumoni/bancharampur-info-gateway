import React, { useState } from "react";
import { useLocalInfo } from "@/contexts/LocalInfoContext";
import type { CloudFunctionInfo } from "@/types/localInfo";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/translations";
import { Code } from "lucide-react";

interface Props {
  language: "bn" | "en";
}

function securityLabel(info: CloudFunctionInfo, lang: "bn" | "en") {
  if (info.enforceAppCheck && info.consumeAppCheckToken)
    return lang === "bn" ? "সর্বোচ্চ নিরাপত্তা" : "Highest Security";
  if (info.enforceAppCheck)
    return lang === "bn" ? "App Check সক্রিয়" : "App Check Enabled";
  return lang === "bn" ? "নিম্ন নিরাপত্তা" : "Low Security";
}

function platformLabel(support?: Array<"ios" | "android" | "web">) {
  if (!support?.length) return "—";
  return support.map(
    plat => 
      plat === "ios" ? "iOS" : plat === "android" ? "Android" : "Web"
  ).join(", ");
}

export const CloudFunctionsManager: React.FC<Props> = ({ language }) => {
  const { localInfoItems } = useLocalInfo();
  const [showExpressExample, setShowExpressExample] = useState(false);
  const cloudFunctions = localInfoItems.filter(
    i => i.categoryId === "cloud_functions"
  ) as CloudFunctionInfo[];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <Code className="inline-block mr-2" /> 
            {language === "bn" ? "ক্লাউড ফাংশনের তালিকা" : "Cloud Functions List"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cloudFunctions.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                {language === "bn"
                  ? "ক্লাউড ফাংশন পাওয়া যায়নি"
                  : "No cloud functions found"}
              </div>
            ) : (
              cloudFunctions.map(fn => (
                <div key={fn.id} className="p-4 glass-morphism rounded-xl shadow flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-semibold text-lg flex items-center gap-2">
                        <span className="text-primary">{fn.functionName}</span>
                        <Badge className="capitalize" variant={fn.status === "active" ? "default" : "secondary"}>
                          {language === "bn"
                            ? fn.status === "active"
                              ? "সক্রিয়"
                              : fn.status === "inactive"
                                ? "নিষ্ক্রিয়"
                                : "ত্রুটি"
                            : fn.status.charAt(0).toUpperCase() + fn.status.slice(1)}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{fn.type}</span>
                    </div>
                    <span>
                      <Badge
                        variant={fn.enforceAppCheck && fn.consumeAppCheckToken ? "default" : "outline"}
                        className={
                          fn.enforceAppCheck && fn.consumeAppCheckToken
                            ? "bg-green-500 text-white"
                            : fn.enforceAppCheck
                              ? "bg-yellow-400 text-black"
                              : "bg-gray-200 text-gray-600"
                        }
                      >
                        {securityLabel(fn, language)}
                      </Badge>
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">{fn.description}</div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                    <span>
                      {language === "bn" ? "শেষ আপডেট:" : "Last updated:"}{" "}
                      {fn.lastUpdated}
                    </span>
                    <span>|</span>
                    <span>
                      {language === "bn" ? "প্ল্যাটফর্ম:" : "Platform:"}{" "}
                      {platformLabel(fn.platformSupport)}
                    </span>
                  </div>
                  {fn.type === "callable" && (
                    <div className="text-xs bg-gray-100 p-2 rounded mt-2">
                      {language === "bn"
                        ? <>iOS Swift/Android/JS SDK {" "}
                          {fn.requireLimitedUseAppCheckTokens
                            ? <span className="inline-block ml-1 px-1.5 bg-green-500 text-white rounded">Limited Use Token</span>
                            : null}
                        </>
                        : <>Supports iOS Swift/Android/JS SDK
                          {fn.requireLimitedUseAppCheckTokens
                            ? <span className="inline-block ml-1 px-1.5 bg-green-500 text-white rounded">Limited Use Token</span>
                            : null}
                        </>}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* App Check Express.js Example -- documentation aid ONLY */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base md:text-lg">
              {language === "bn"
                ? "Express.js এ App Check নিরাপত্তা উদাহরণ"
                : "App Check Security Example for Express.js"}
            </CardTitle>
            <button
              type="button"
              className="text-xs px-3 py-0.5 bg-primary/10 rounded border border-primary/30 hover:bg-primary/20 transition"
              onClick={() => setShowExpressExample(val => !val)}
            >
              {showExpressExample
                ? language === "bn" ? "লুকান" : "Hide"
                : language === "bn" ? "দেখান" : "Show"}
            </button>
          </div>
        </CardHeader>
        {showExpressExample && (
          <CardContent>
            <div className="bg-neutral-900 text-green-200 rounded p-3 font-mono text-xs overflow-auto select-all relative">
              <pre>
{`import express from "express";
import { initializeApp } from "firebase-admin/app";
import { getAppCheck } from "firebase-admin/app-check";

const expressApp = express();
const firebaseApp = initializeApp();

const appCheckVerification = async (req, res, next) => {
  const appCheckToken = req.header("X-Firebase-AppCheck");

  if (!appCheckToken) {
    res.status(401);
    return next("Unauthorized");
  }

  try {
    const appCheckClaims = await getAppCheck().verifyToken(appCheckToken, { consume: true });

    if (appCheckClaims.alreadyConsumed) {
      res.status(401);
      return next("Unauthorized");
    }

    // If verifyToken() succeeds and alreadyConsumed is not set, okay to continue.
    return next();
  } catch (err) {
    res.status(401);
    return next("Unauthorized");
  }
};

expressApp.get("/yourApiEndpoint", [appCheckVerification], (req, res) => {
  // Handle request
});`}
              </pre>
              <button
                className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/40 hover:bg-black/70 text-white text-xs"
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
`import express from "express";
import { initializeApp } from "firebase-admin/app";
import { getAppCheck } from "firebase-admin/app-check";

const expressApp = express();
const firebaseApp = initializeApp();

const appCheckVerification = async (req, res, next) => {
  const appCheckToken = req.header("X-Firebase-AppCheck");

  if (!appCheckToken) {
    res.status(401);
    return next("Unauthorized");
  }

  try {
    const appCheckClaims = await getAppCheck().verifyToken(appCheckToken, { consume: true });

    if (appCheckClaims.alreadyConsumed) {
      res.status(401);
      return next("Unauthorized");
    }

    // If verifyToken() succeeds and alreadyConsumed is not set, okay to continue.
    return next();
  } catch (err) {
    res.status(401);
    return next("Unauthorized");
  }
};

expressApp.get("/yourApiEndpoint", [appCheckVerification], (req, res) => {
  // Handle request
});`
                  );
                }}
              >
                {language === "bn" ? "কপি করুন" : "Copy"}
              </button>
            </div>
            <div className="text-sm mt-3 text-gray-700">
              {language === "bn" ? (
                <>
                  <b>নোট:</b> এই middleware <b>Firebase App Check</b> এর limited-use (consumeable) token ব্যবহার করলে token valido থাকা এবং পূর্বে ব্যবহৃত হয়নি তা যাচাই করে। <b>alreadyConsumed</b> true হলে token আগেই ব্যবহার হয়েছে অর্থাৎ প্রত্যাখ্যাত হবে। <br />
                  <b>শুধুমাত্র আধুনিক ক্লায়েন্ট SDK ও production নিরাপত্তা নিশ্চিতকরণের জন্য এটি অত্যাবশ্যক।</b>
                </>
              ) : (
                <>
                  <b>Note:</b> This middleware verifies the <b>Firebase App Check</b> limited-use (consumable) token, ensuring it is valid and <b>not reused</b>. If <b>alreadyConsumed</b> is true, the token has been previously used and is rejected. <br />
                  <b>This ensures strong protection against replay attacks for production App Check-enabled clients.</b>
                </>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
