import crypto from 'crypto';

type Param = { text: string };

export const encrypt = ({ text }: Param) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.CRYPTO_SECRET, 'hex'),
    iv
  );

  const encryptedText = cipher.update(text);
  const finalText = Buffer.concat([encryptedText, cipher.final()]);

  return `${iv.toString('hex')}-${finalText.toString('hex')}`;
};

export const decrypt = ({ text }: Param) => {
  const [iv, encryptedText] = text.split('-');

  const ivBuffer = Buffer.from(iv, 'hex');
  const encryptedTextBuffer = Buffer.from(encryptedText, 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.CRYPTO_SECRET, 'hex'),
    ivBuffer
  );
  let decrypted = decipher.update(encryptedTextBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
