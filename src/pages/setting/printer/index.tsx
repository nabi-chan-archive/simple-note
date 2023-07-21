import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import Layout from "@/components/Layout";
import { type PrinterSchemaValues, printerSchema } from "@/schema/form/printer";
import { api } from "@/utils/api";

export default function SettingPrinter() {
  const trpc = api.useContext();

  const { data: printer } = api.printer.getPrinter.useQuery();

  const { mutate: createPrinter } = api.printer.createPrinter.useMutation();
  const { mutate: deletePrinter } = api.printer.deletePrinter.useMutation();

  const {
    register,
    handleSubmit: submit,
    reset,
  } = useForm<PrinterSchemaValues>({
    resolver: zodResolver(printerSchema),
    defaultValues: {
      ip: printer?.ip,
      port: printer?.port,
    },
  });

  const handleSubmit = submit((data) => {
    createPrinter(
      {
        ip: data.ip,
        port: data.port,
      },
      {
        onSuccess: () => void trpc.printer.getPrinter.invalidate(),
      }
    );
  });

  const handlePrinterDelete = () => {
    deletePrinter(
      {
        id: printer!.id,
      },
      {
        onSuccess: () => {
          void trpc.printer.getPrinter.invalidate();
          reset();
        },
      }
    );
  };

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-bold">🖨️ 프린터 설정</h1>

      <form onSubmit={(e) => void handleSubmit(e)}>
        <label className="mb-4 flex items-center gap-4">
          <span className="flex-1 font-bold">프린터 IP</span>
          <input
            {...register("ip", {
              required: true,
            })}
            type="text"
            className="input input-bordered flex-[3]"
            placeholder="192.168.0.3"
            defaultValue={printer?.ip}
          />
        </label>
        <label className="mb-4 flex items-center gap-4">
          <span className="flex-1 font-bold">프린터 포트</span>
          <input
            {...register("port", {
              required: true,
            })}
            type="text"
            className="input input-bordered flex-[3]"
            placeholder="9100"
            defaultValue={printer?.port}
          />
        </label>

        <div className="mt-16 flex justify-end gap-2">
          {printer ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => void handlePrinterDelete()}
            >
              연동해제하기
            </button>
          ) : (
            <button type="submit" className="btn btn-primary btn-sm">
              연동하기
            </button>
          )}
          <Link href="/" className="btn btn-ghost btn-sm">
            취소하기
          </Link>
        </div>
      </form>
    </Layout>
  );
}
