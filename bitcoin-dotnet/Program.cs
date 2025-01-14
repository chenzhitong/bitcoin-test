using NBitcoin;

namespace bitcoin
{
    public class Program
    {
        public static void Main()
        {
            // 使用比特币主网
            Network network = Network.Main;

            string xprv = "xprvA2rq8PAb5nCHJZfTQmojWe2ZLxMJLgCUHiVEuUhJGGXyoSTo9a8mAmYByeWaAZj5B2WhfkFv4HaqNkr9kafHqH7Yfrjf86f29Q3vEnnpnrT";

            try
            {
                // 使用 BitcoinExtKey 解析 Base58 格式的 xprv
                var bitcoinExtKey = new BitcoinExtKey(xprv, network);
                ExtKey extKey = bitcoinExtKey.ExtKey;

                // 提取私钥
                Key privateKey = extKey.PrivateKey;
                // 输出16进制格式的私钥
                Console.WriteLine($"私钥 (Private Key in Hex): 0x{privateKey.ToHex()}");

                // 获取扩展密钥信息
                Console.WriteLine("深度 (Depth): " + extKey.Depth);
                Console.WriteLine("父密钥指纹 (Parent Fingerprint): " + extKey.ParentFingerprint.ToString());
                Console.WriteLine("链码 (Chain Code): " + BitConverter.ToString(extKey.ChainCode).Replace("-", "").ToLower());
                Console.WriteLine("是否为主密钥 (Is Master Key): " + (extKey.Depth == 0));

                // 提取公钥
                PubKey pubKey = privateKey.PubKey;

                // 使用 BIP86 生成 Taproot 地址 (P2TR)
                BitcoinAddress taprootAddress = pubKey.GetAddress(ScriptPubKeyType.TaprootBIP86, network);

                // 输出 Bech32m 地址 (bc1p)
                Console.WriteLine("生成的 Taproot 地址 (bc1p): " + taprootAddress);
            }
            catch (Exception ex)
            {
                Console.WriteLine("错误: " + ex.Message);
            }
        }
    }
}
